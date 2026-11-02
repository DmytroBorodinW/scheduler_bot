import { PERSON_HANDLES, REHEARSAL_DAYS, SCHEDULE_RULES, SERVICE_DAYS, TEAM_MEMBERS } from '../constants.js';
import { EventLocations, TechEventKey, type WorshipDay, type WorshipSchedule } from '../types.js';
import { cleanSheetText, parseTableDate } from '../utils.js';

const JOINT_REHEARSAL = 'Репетиція (Вокал + Інструментал)';

export const normalizeCategoryKey = (value: string): string => cleanSheetText(value).replace(/\s+/g, '');

const isCategoryHeader = (value: string): boolean => {
  const key = normalizeCategoryKey(value);

  return key.includes('Вокал') || key.includes('Інст');
};

export const resolvePersonHandle = (name: string): string => {
  const cleaned = cleanSheetText(name);
  if (!cleaned) return '';

  return PERSON_HANDLES[cleaned] ?? cleaned;
};

export const parseTeamsConfig = (data: string[][] | null | undefined): Record<string, string[]> => {
  if (!data?.length) return {};

  let headerRowIdx = -1;

  for (let i = 0; i < data.length; i++) {
    const row = data[i] ?? [];
    const hasCategoryHeaders = row.some(cell => isCategoryHeader(cell ?? ''));

    if (!hasCategoryHeaders) continue;

    const isTitleOnly =
      row.some(cell => cleanSheetText(cell ?? '').includes('Команди')) &&
      !row.some(cell => isCategoryHeader(cell ?? ''));

    if (isTitleOnly) continue;

    headerRowIdx = i;
    break;
  }

  // Title row "Команди" then headers on the next line
  if (headerRowIdx < 0) {
    for (let i = 0; i < data.length - 1; i++) {
      const row = data[i] ?? [];
      if (row.some(cell => cleanSheetText(cell ?? '').includes('Команди'))) {
        const next = data[i + 1] ?? [];
        if (next.some(cell => isCategoryHeader(cell ?? ''))) {
          headerRowIdx = i + 1;
          break;
        }
      }
    }
  }

  if (headerRowIdx < 0) {
    console.warn('⚠️ Команди block not found in teams range');
    return {};
  }

  const headers = data[headerRowIdx] ?? [];
  const teams: Record<string, string[]> = {};
  const unresolvedNames = new Set<string>();

  headers.forEach((header, colIdx) => {
    if (!isCategoryHeader(header ?? '')) return;

    const key = normalizeCategoryKey(header);
    const members: string[] = [];

    for (let r = headerRowIdx + 1; r < data.length; r++) {
      const rawName = cleanSheetText(data[r]?.[colIdx] ?? '');
      if (!rawName) break;

      const handle = resolvePersonHandle(rawName);
      members.push(handle);

      if (handle === rawName && !rawName.startsWith('@')) {
        unresolvedNames.add(rawName);
      }
    }

    if (members.length) {
      teams[key] = members;
    }
  });

  if (unresolvedNames.size) {
    console.warn(`⚠️ No Telegram handle for: ${Array.from(unresolvedNames).join(', ')} (using names as-is)`);
  }

  console.log(`👥 Loaded ${Object.keys(teams).length} teams from sheet: ${Object.keys(teams).join(', ')}`);

  return teams;
};

/** Match schedule cell keys to Команди headers (spaces / trailing "1" differences). */
export const lookupSheetTeam = (rawKey: string, teams: Record<string, string[]>): string[] | undefined => {
  const key = normalizeCategoryKey(rawKey);
  if (!key) return undefined;

  if (teams[key]) return teams[key];

  // "ВокалЧт1" ↔ "ВокалЧт" (November headers omit the 1)
  if (key.endsWith('1') && teams[key.slice(0, -1)]) {
    return teams[key.slice(0, -1)];
  }

  if (teams[`${key}1`]) return teams[`${key}1`];

  return undefined;
};

const isCombinedTeam = (key: string) => key.includes('/') && key.includes('Вокал') && key.includes('Інст');

const isSundayTeamKey = (key: string) => /Нд/.test(key);

/** Labels for rehearsals that prepare Sunday service (ВокалНд / ІнстНд on Fri etc.). */
const getSundayPrepType = (key: string): string => {
  if (isCombinedTeam(key)) {
    return 'Репетиція до неділі (Вокал + Інструментал)';
  }
  if (key.includes('Вокал')) return 'Вокал до неділі';
  if (key.includes('Інст')) return 'Інструментал до неділі';
  return 'Репетиція до неділі';
};

const getRehearsalType = (key: string, dayName: string, rules: any): string => {
  // Sunday-team slots on other weekdays = prep for Sunday service
  if (isSundayTeamKey(key) && dayName !== 'неділя') {
    return getSundayPrepType(key);
  }

  if (isCombinedTeam(key)) {
    return JOINT_REHEARSAL;
  }

  if (key.includes('Інст')) {
    return rules.instrumental?.type ?? JOINT_REHEARSAL;
  }

  return rules.vocal?.type ?? 'Вокальна репетиція';
};

export const generateDayMessage = (dayData: WorshipDay) => {
  const dayName = dayData.date.split(',')[0].toLowerCase();
  const rules = SCHEDULE_RULES[dayName];
  if (!rules) return '';

  let message = `📅 <b>${dayData.date.toUpperCase()}</b>\n`;

  // --- СПЕЦІАЛЬНА ЛОГІКА ДЛЯ СЕРЕДИ ТА НЕДІЛІ ---
  if (SERVICE_DAYS.includes(dayName)) {
    message += `\n${rules.mainEvent}\n`;

    // Шукаємо інструментал
    const instEvent = dayData.events.find((e: any) => e.key.includes('Інст') || e.key.includes('/'));
    if (instEvent) {
      message += `\n⏰ <b>${rules.rehearsalTime}</b> — ${rules.location}`;
      message += `\n🎸 ${rules.type}`;
      message += `\nСклад: ${instEvent.mentions}\n`;
    }

    // Додаємо Звук та Апаратуру (без часу)
    const soundEvent = dayData.events.find((e: any) => e.key.includes(TechEventKey.SOUND));
    const gearEvent = dayData.events.find((e: any) => e.key.includes(TechEventKey.SOUND_EQUIPMENT));

    if (soundEvent) message += `\n🔊 <b>Звук:</b> ${soundEvent.mentions}`;
    if (gearEvent) message += `\n🎹 <b>Апаратура:</b> ${gearEvent.mentions}`;

    return message + '\n';
  }

  // --- ЛОГІКА ДЛЯ ІНШИХ ДНІВ ---
  dayData.events.forEach((event: any) => {
    // Пропускаємо технічні ключі (S/SE), якщо це не середа
    if (event.key.includes(TechEventKey.SOUND) || event.key.includes(TechEventKey.SOUND_EQUIPMENT)) return;

    let eventTime = rules.time;
    let eventLocation = event.location ? event.location : rules.location;
    let eventType = rules.type;

    if (REHEARSAL_DAYS.includes(dayName)) {
      const usesInstrumentalSlot = isCombinedTeam(event.key) || event.key.includes('Інст');

      if (usesInstrumentalSlot) {
        eventTime = rules.instrumental.time;
        eventLocation = rules.instrumental.location;
      } else {
        eventTime = rules.vocal.time;
        eventLocation = event.location ? event.location : rules.vocal.location;
      }

      eventType = getRehearsalType(event.key, dayName, rules);
    }

    message += `\n⏰ <b>${eventTime}</b> — ${eventLocation}`;
    message += `\n🎤 ${eventType}`;
    message += `\nСклад: ${event.mentions}\n`;
  });

  return message;
};

const isTechKey = (key: string): boolean =>
  key.includes(TechEventKey.SOUND) || key.includes(TechEventKey.SOUND_EQUIPMENT);

const getMentions = (key: string, teamsFromSheet: Record<string, string[]> = {}): string => {
  if (!key) return '';

  // Mixed categories: 'ВокалЧт2 / ІнстЧт' → take members from every part
  const keys = key.split('/').map(k => cleanSheetText(k));

  const allMentions = keys.flatMap(k => {
    if (isTechKey(k)) {
      const member = TEAM_MEMBERS[k];
      if (!member) return [];
      return Array.isArray(member) ? member : [member];
    }

    const fromSheet = lookupSheetTeam(k, teamsFromSheet);
    if (fromSheet?.length) return fromSheet;

    const fallback = TEAM_MEMBERS[k];
    if (!fallback) {
      console.warn(`⚠️ No team found for category "${k}"`);
      return [];
    }
    return Array.isArray(fallback) ? fallback : [fallback];
  });

  return Array.from(new Set(allMentions)).join(' ');
};

export const parseWorshipSchedule = (
  data: string[][] | null | undefined,
  teamsFromSheet: Record<string, string[]> = {}
): WorshipSchedule | undefined => {
  if (!data) return;

  const monthWeek: Record<string, any> = {};
  let currentMondayKey: string | null = null;

  data.forEach(row => {
    const firstCell = row[0] ? cleanSheetText(row[0]) : '';

    // Skip Команди title row if calendar range accidentally includes it
    if (row.some(cell => cleanSheetText(cell ?? '').includes('Команди'))) {
      return;
    }

    // 1. Перевіряємо, чи цей рядок є "Заголовком дат" (шукаємо "Tue")
    if (firstCell.includes('Tue')) {
      const tueDate = parseTableDate(firstCell);
      // Створюємо ключ понеділка
      const mon = new Date(tueDate);
      mon.setDate(mon.getDate() - 1);
      mon.setHours(0, 0, 0, 0); // Обнуляємо час для чистого ключа

      currentMondayKey = mon.getTime().toString();

      // Ініціалізуємо об'єкт тижня
      monthWeek[currentMondayKey] = {};

      // Заповнюємо дати для кожного стовпця
      row.forEach((dateStr, idx) => {
        const cleaned = cleanSheetText(dateStr);
        if (!cleaned) return;
        monthWeek[currentMondayKey!][idx] = {
          date: parseTableDate(cleaned).toLocaleString('uk-UA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }),
          events: [], // Тут будуть наші команди
        };
      });
      return; // Йдемо до наступного рядка
    }

    // 2. Якщо ми вже всередині якогось тижня і рядок не порожній
    if (currentMondayKey && row.some(cell => cleanSheetText(cell) !== '')) {
      row.forEach((cell, idx) => {
        const cleanedCell = cleanSheetText(cell);
        if (cleanedCell !== '' && monthWeek[currentMondayKey!][idx]) {
          // Розбиваємо клітинку по розділювачу '|'
          const parts = cleanedCell.split('|').map(s => cleanSheetText(s));
          let label: string;
          let key: string;
          let location: string;
          let mentions: string | string[];

          if (parts.length >= 2) {
            label = parts[0];
            key = parts[0];
            mentions = getMentions(key, teamsFromSheet);
            location = parts[1];
          } else {
            label = cleanedCell;
            key = cleanedCell;
            mentions = getMentions(key, teamsFromSheet);
            location = EventLocations.MUSIC_ROOM;
          }

          monthWeek[currentMondayKey!][idx].events.push({
            label, // "ВокалПт / ІнстПт"
            key, // "ВокалПт / ІнстПт"
            mentions,
            location,
          });
        }
      });
    }
  });
  return monthWeek;
};
