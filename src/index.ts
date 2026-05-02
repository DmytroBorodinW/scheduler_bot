import * as dotenv from "dotenv";
import "dotenv/config";
import { google } from "googleapis";
import * as path from "path";
import { generateDayMessage, parseWorshipSchedule } from "./parser.js";
import { bot } from "./telegram.js";
import { getCurrentMondayTimestamp, getCurrentMonthName } from "./utils.js";

dotenv.config();
const CHAT_ID = process.env.CHAT_ID;
const SPREAD_SHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_RANGE = process.env.SHEET_RANGE;

async function testConnection() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "google-key.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // ID таблиці можна взяти з посилання: /spreadsheets/d/[ЦЕЙ_ID]/edit
  const spreadsheetId = SPREAD_SHEET_ID;
  const monthSheet = getCurrentMonthName();
  const range = `${monthSheet}!${SHEET_RANGE}`;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range,
    });

    const schedule = parseWorshipSchedule(res.data.values);
    const currentWeekKey = getCurrentMondayTimestamp();

    if (schedule && schedule[currentWeekKey]) {
      const currentWeekDays = schedule[currentWeekKey];

      console.log(
        `📌 Розклад на поточний тиждень (${new Date(Number(currentWeekKey)).toLocaleDateString()}):`,
      );

      // 1. Створюємо масив для збору повідомлень по кожному дню
      const dailyMessages: string[] = [];

      Object.values(currentWeekDays).forEach((dayData: any) => {
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

testConnection();
