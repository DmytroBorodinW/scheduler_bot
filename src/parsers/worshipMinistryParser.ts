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
import { parseTableDate } from "../utils.js";

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
      if (event.key.includes("/")) {
        eventTime = rules.instrumental.time;
        eventLocation = rules.instrumental.location;
        eventType = rules.instrumental.type;
      } else {
        eventTime = rules.vocal.time;
        eventLocation = event.location ? event.location : rules.vocal.location;
        eventType = rules.vocal.type;
      }
    }

    message += `\n⏰ <b>${eventTime}</b> — ${eventLocation}`;
    message += `\n🎤 ${eventType}`;
    message += `\nСклад: ${event.mentions}\n`;
  });

  return message;
};

const getMentions = (key: string): string => {
  if (!key) return "";

  // Розбиваємо ключ, якщо там є '/', наприклад 'VThu1/InstThu'
  const keys = key.split("/").map((k) => k.trim());

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
    // 1. Перевіряємо, чи цей рядок є "Заголовком дат" (шукаємо "Tue")
    if (row[0] && row[0].includes("Tue")) {
      const tueDate = parseTableDate(row[0]);
      // Створюємо ключ понеділка
      const mon = new Date(tueDate);
      mon.setDate(mon.getDate() - 1);
      mon.setHours(0, 0, 0, 0); // Обнуляємо час для чистого ключа

      currentMondayKey = mon.getTime().toString();

      // Ініціалізуємо об'єкт тижня
      monthWeek[currentMondayKey] = {};

      // Заповнюємо дати для кожного стовпця (0..3)
      row.forEach((dateStr, idx) => {
        monthWeek[currentMondayKey!][idx] = {
          date: parseTableDate(dateStr).toLocaleString("uk-UA", {
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
    if (currentMondayKey && row.some((cell) => cell.trim() !== "")) {
      row.forEach((cell, idx) => {
        if (cell.trim() !== "" && monthWeek[currentMondayKey!][idx]) {
          // Розбиваємо клітинку по розділювачу '|'
          const parts = cell.split("|").map((s) => s.trim());
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
            label = cell;
            key = cell;
            mentions = getMentions(key);
            location = EventLocations.MUSIC_ROOM;
          }

          monthWeek[currentMondayKey!][idx].events.push({
            label, // "ВокалПт / ІнстП"
            key, // "ВокалПт / ІнстП"
            mentions, // "@kosarchuk Наталя @Max_333_g @MmaximysS @ruslan_yolo"
            location,
          });
        }
      });
    }
  });
  return monthWeek;
};
