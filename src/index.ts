import * as dotenv from "dotenv";
import "dotenv/config";
import { google } from "googleapis";
import {
  generateDayMessage,
  parseWorshipSchedule,
} from "./parsers/worshipMinistryParser.js";
import {
  generateFullWeekSchedule,
  parseScheduleToMonthObject,
} from "./parsers/youthMinistryParser.js";
import { bot } from "./telegram.js";
import type { WorshipWeek } from "./types.js";
import { getCurrentMondayTimestamp, getTableRange } from "./utils.js";

dotenv.config();
const CHAT_ID = process.env.CHAT_ID;
const SPREAD_SHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_RANGE = process.env.SHEET_RANGE;

function authToSpreadSheetAPI() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Важливо: повертаємо реальні переноси рядків
      project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

async function generateWorshipTeamScheduleFromSpreadsheet() {
  console.log(
    "ENV CHECK:",
    process.env.SPREADSHEET_ID ? "ID EXISTS" : "ID IS EMPTY",
  );

  if (!SPREAD_SHEET_ID || !SHEET_RANGE) return;

  const sheets = authToSpreadSheetAPI();

  // ID таблиці можна взяти з посилання: /spreadsheets/d/[ЦЕЙ_ID]/edit
  const range = getTableRange(SHEET_RANGE);

  console.log(`🔎 Спроба знайти таблицю ID: ${SPREAD_SHEET_ID}`);
  console.log(`🔎 Шукаю діапазон: ${range}`);

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREAD_SHEET_ID,
      range: range,
    });

    const schedule = parseWorshipSchedule(res.data.values);
    const currentWeekKey = getCurrentMondayTimestamp();

    if (schedule && schedule[currentWeekKey]) {
      const currentWeekDays: WorshipWeek = schedule[currentWeekKey];

      console.log(
        `📌 Розклад на поточний тиждень (${new Date(Number(currentWeekKey)).toLocaleDateString()}):`,
      );

      // 1. Створюємо масив для збору повідомлень по кожному дню
      const dailyMessages: string[] = [];

      Object.values(currentWeekDays)
        .filter((dayData) => dayData.events.length)
        .forEach((dayData: any) => {
          const message = generateDayMessage(dayData);
          if (message) {
            dailyMessages.push(message);
          }
        });

      // 2. Якщо є повідомлення, з'єднуємо їх у одне велике
      if (dailyMessages.length > 0) {
        // Використовуємо розділювач, наприклад, лінію або подвійний перенос
        const finalMessage = dailyMessages.join("\n" + "—".repeat(20) + "\n");

        // 3. Відправляємо ОДНЕ повідомлення
        bot.telegram
          .sendMessage(CHAT_ID ? CHAT_ID : "", finalMessage, {
            parse_mode: "HTML",
          })
          .then(() =>
            console.log("✅ Розклад на тиждень надіслано одним повідомленням!"),
          )
          .catch((err) => console.error("❌ Помилка відправки:", err));
      }
    } else {
      console.log("😕 На цей тиждень розкладу не знайдено.");
    }
  } catch (err) {
    console.error("Помилка авторизації або доступу:", err);
  }
}

const YOUTH_MINISTRY_SPREADSHEET_ID = process.env.YOUTH_MINISTRY_SPREADSHEET_ID;
const YOUTH_MINISTRY_SHEET_RANGE = process.env.YOUTH_MINISTRY_SHEET_RANGE;

async function generateYouthMinistryTeamSchedule() {
  const sheets = authToSpreadSheetAPI();

  if (!YOUTH_MINISTRY_SHEET_RANGE || !YOUTH_MINISTRY_SPREADSHEET_ID) return;
  const range = getTableRange(YOUTH_MINISTRY_SHEET_RANGE);

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: YOUTH_MINISTRY_SPREADSHEET_ID,
      range: range,
    });

    if (!res.data.values) {
      console.error("Розклад не знайдено:");
      return;
    }

    const schedule = parseScheduleToMonthObject(res.data.values);
    const message = generateFullWeekSchedule(schedule);

    bot.telegram
      .sendMessage(CHAT_ID ? CHAT_ID : "", message, {
        parse_mode: "HTML",
      })
      .then(() =>
        console.log("✅ Розклад на тиждень надіслано одним повідомленням!"),
      )
      .catch((err) => console.error("❌ Помилка відправки:", err));
    console.log(message);
  } catch (err) {
    console.error("Помилка авторизації або доступу:", err);
  }
}

generateYouthMinistryTeamSchedule();

generateWorshipTeamScheduleFromSpreadsheet();
