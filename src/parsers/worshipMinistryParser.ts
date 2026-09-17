import {
  REHEARSAL_DAYS,
  SCHEDULE_RULES,
  SERVICE_DAYS,
  TEAM_MEMBERS,
} from "../constants.js";
import {
  EventLocations,
  TechEventKey,
  type WorshipDay,
  type WorshipSchedule,
} from "../types.js";
import { cleanSheetText, parseTableDate } from "../utils.js";

const JOINT_REHEARSAL = "Репетиція (Вокал + Інструментал)";

const isCombinedTeam = (key: string) =>
  key.includes("/") && key.includes("Вокал") && key.includes("Інст");

const isSundayTeamKey = (key: string) => /Нд/.test(key);

/** Labels for rehearsals that prepare Sunday service (ВокалНд / ІнстНд on Fri etc.). */
const getSundayPrepType = (key: string): string => {
  if (isCombinedTeam(key)) {
    return "Репетиція до неділі (Вокал + Інструментал)";
  }
  if (key.includes("Вокал")) return "Вокал до неділі";
  if (key.includes("Інст")) return "Інструментал до неділі";
  return "Репетиція до неділі";
};

const getRehearsalType = (key: string, dayName: string, rules: any): string => {
  // Sunday-team slots on other weekdays = prep for Sunday service
  if (isSundayTeamKey(key) && dayName !== "неділя") {
    return getSundayPrepType(key);
  }

  if (isCombinedTeam(key)) {
    return JOINT_REHEARSAL;
  }

  if (key.includes("Інст")) {
    return rules.instrumental?.type ?? JOINT_REHEARSAL;
  }

  return rules.vocal?.type ?? "Вокальна репетиція";
};

export const generateDayMessage = (dayData: WorshipDay) => {
  const dayName = dayData.date.split(",")[0].toLowerCase();
  const rules = SCHEDULE_RULES[dayName];
  if (!rules) return "";

  let message = `📅 <b>${dayData.date.toUpperCase()}</b>\n`;

  // --- СПЕЦІАЛЬНА ЛОГІКА ДЛЯ СЕРЕДИ ТА НЕДІЛІ ---
  if (SERVICE_DAYS.includes(dayName)) {
    message += `\n${rules.mainEvent}\n`;

    // Шукаємо інструментал
    const instEvent = dayData.events.find(
      (e: any) => e.key.includes("Інст") || e.key.includes("/"),
    );
    if (instEvent) {
      message += `\n⏰ <b>${rules.rehearsalTime}</b> — ${rules.location}`;
      message += `\n🎸 ${rules.type}`;
      message += `\nСклад: ${instEvent.mentions}\n`;
    }

    // Додаємо Звук та Апаратуру (без часу)
    const soundEvent = dayData.events.find((e: any) =>
      e.key.includes(TechEventKey.SOUND),
    );
    const gearEvent = dayData.events.find((e: any) =>
      e.key.includes(TechEventKey.SOUND_EQUIPMENT),
    );

    if (soundEvent) message += `\n🔊 <b>Звук:</b> ${soundEvent.mentions}`;
    if (gearEvent) message += `\n🎹 <b>Апаратура:</b> ${gearEvent.mentions}`;

    return message + "\n";
  }

  // --- ЛОГІКА ДЛЯ ІНШИХ ДНІВ ---
  dayData.events.forEach((event: any) => {
    // Пропускаємо технічні ключі (S/SE), якщо це не середа
    if (
      event.key.includes(TechEventKey.SOUND) ||
      event.key.includes(TechEventKey.SOUND_EQUIPMENT)
    )
      return;

    let eventTime = rules.time;
    let eventLocation = event.location ? event.location : rules.location;
    let eventType = rules.type;

    if (REHEARSAL_DAYS.includes(dayName)) {
      const usesInstrumentalSlot =
        isCombinedTeam(event.key) || event.key.includes("Інст");

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

const getMentions = (key: string): string => {
  if (!key) return "";

  // Розбиваємо ключ, якщо там є '/', наприклад 'ВокалЧт1 / ІнстЧт'
  const keys = key.split("/").map((k) => cleanSheetText(k));

  const allMentions = keys.flatMap((k) => {
    const member = TEAM_MEMBERS[k];
    if (!member) return [];
    // Якщо в об'єкті масив — повертаємо його, якщо стрінга — загортаємо в масив
    return Array.isArray(member) ? member : [member];
  });

  // Використовуємо Set, щоб уникнути дублікатів (якщо людина в обох списках)
  return Array.from(new Set(allMentions)).join(" ");
};

export const parseWorshipSchedule = (
  data: string[][] | null | undefined,
): WorshipSchedule | undefined => {
  if (!data) return;

  const monthWeek: Record<string, any> = {};
  let currentMondayKey: string | null = null;

  data.forEach((row) => {
    const firstCell = row[0] ? cleanSheetText(row[0]) : "";

    // 1. Перевіряємо, чи цей рядок є "Заголовком дат" (шукаємо "Tue")
    if (firstCell.includes("Tue")) {
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
          date: parseTableDate(cleaned).toLocaleString("uk-UA", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
          events: [], // Тут будуть наші команди
        };
      });
      return; // Йдемо до наступного рядка
    }

    // 2. Якщо ми вже всередині якогось тижня і рядок не порожній
    if (
      currentMondayKey &&
      row.some((cell) => cleanSheetText(cell) !== "")
    ) {
      row.forEach((cell, idx) => {
        const cleanedCell = cleanSheetText(cell);
        if (cleanedCell !== "" && monthWeek[currentMondayKey!][idx]) {
          // Розбиваємо клітинку по розділювачу '|'
          const parts = cleanedCell.split("|").map((s) => cleanSheetText(s));
          let label: string;
          let key: string;
          let location: string;
          let mentions: string | string[];

          if (parts.length >= 2) {
            label = parts[0];
            key = parts[0];
            mentions = getMentions(key);
            location = parts[1];
          } else {
            label = cleanedCell;
            key = cleanedCell;
            mentions = getMentions(key);
            location = EventLocations.MUSIC_ROOM;
          }

          monthWeek[currentMondayKey!][idx].events.push({
            label, // "ВокалПт / ІнстПт"
            key, // "ВокалПт / ІнстПт"
            mentions, // "@kosarchuk Наталя @MmaximysS @ruslan_yolo @tania_zaritska"
            location,
          });
        }
      });
    }
  });
  return monthWeek;
};
