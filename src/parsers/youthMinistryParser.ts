import { dayNames, days, emojiMap, monthNames } from "../constants.js";
import type {
  YouthMInistryMonthSchedule,
  YouthMinistryWeekSch,
} from "../types.js";
import { getCurrentMondayTimestamp } from "../utils.js";

/**
 * Допоміжна функція для створення таймстемпу з рядка 'Mon, 27.04.26'
 */
function parseToTimestamp(dateStr: string): string {
  // Витягуємо тільки частину з датою: '27.04.26'
  const cleanDate = dateStr.split(",")[1]?.trim();
  if (!cleanDate) return Date.now().toString();

  const [day, month, year] = cleanDate.split(".").map(Number);
  // Створюємо дату (враховуємо 2000-ні роки)
  const date = new Date(2000 + year, month - 1, day, 0, 0, 0);

  return date.getTime().toString();
}

export function parseScheduleToMonthObject(
  data: string[][],
): YouthMInistryMonthSchedule {
  const schedule: YouthMInistryMonthSchedule = {};

  // Проходимо масив з кроком 3 (Дати -> Події -> Пусто)
  for (let i = 0; i < data.length; i += 3) {
    const datesRow = data[i]; // ['Mon, 27.04.26', 'Tue, 28.04.26'...]
    const eventsRow = data[i + 1]; // ['Групки', '', 'Тема: ...'...]

    if (!datesRow || !eventsRow || datesRow.length === 0) continue;

    // Шукаємо понеділок у цьому рядку, щоб створити ключ (таймстемп)
    const mondayStr = datesRow.find((d) => d.includes("Mon"));
    if (!mondayStr) continue;

    // Перетворюємо дату понеділка в таймстемп (початок тижня)
    const timestamp = parseToTimestamp(mondayStr);

    // Ініціалізуємо об'єкт тижня
    const week: YouthMinistryWeekSch = {
      Mon: eventsRow[0] || "",
      Tue: eventsRow[1] || "",
      Wed: eventsRow[2] || "",
      Thu: eventsRow[3] || "",
      Fri: eventsRow[4] || "",
      Sat: eventsRow[5] || "",
      Sun: eventsRow[6] || "",
    };

    schedule[timestamp] = week;
  }

  return schedule;
}

export const generateYouthDayMessage = (
  dayKey: keyof YouthMinistryWeekSch,
  dayContent: string,
  mondayTimestamp: string,
): string => {
  // Розраховуємо реальну дату для заголовка
  const date = new Date(Number(mondayTimestamp));
  const dayIndex = days.indexOf(dayKey);
  date.setDate(date.getDate() + dayIndex);

  const dayOfMonth = date.getDate();
  const monthName = monthNames[date.getMonth()];

  // Заголовок: 📅 ВІВТОРОК, 5 ТРАВНЯ
  let message = `📅 <b>${dayNames[dayKey]}, ${dayOfMonth} ${monthName}</b>\n`;

  const lines = dayContent.split("\n");

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (trimmedLine.includes(":")) {
      const [key, ...valueParts] = trimmedLine.split(":");
      const cleanKey = key.trim();
      const value = valueParts.join(":").trim();
      const emoji = emojiMap[cleanKey] || "🔹";

      // Форматування згідно з референсом: Емодзі Ключ: Значення
      message += `\n${emoji} <b>${cleanKey}:</b> ${value}`;
    } else {
      // Якщо це просто текст, наприклад "Молодіжка о 19:00"
      // Додаємо емодзі церкви для молодіжки або просто текст
      const prefix = trimmedLine.toLowerCase().includes("молодіжка")
        ? "⛪️ "
        : "";
      message += `\n${prefix}${trimmedLine}`;
    }
  });

  return message;
};

export const generateFullWeekSchedule = (
  schedule: YouthMInistryMonthSchedule,
): string => {
  const currentMondayKey = getCurrentMondayTimestamp();
  const weekData = schedule[currentMondayKey];

  if (!weekData) return "🗓 <b>Розклад на цей тиждень відсутній</b>";

  const dailyMessages: string[] = [];

  days.forEach((dayKey) => {
    const content = weekData[dayKey];
    if (content && content.trim()) {
      const msg = generateYouthDayMessage(dayKey, content, currentMondayKey);
      dailyMessages.push(msg);
    }
  });

  if (dailyMessages.length === 0) {
    return "🗓 <b>На цей тиждень нічого не заплановано</b>";
  }

  // Головний заголовок повідомлення
  const header = "🗓 <b>** Розклад служінь **</b>\n\n";

  // Розділювач між днями
  const divider = "\n\n" + "—".repeat(20) + "\n";

  // З'єднуємо все в один текст
  return header + dailyMessages.join(divider);
};
