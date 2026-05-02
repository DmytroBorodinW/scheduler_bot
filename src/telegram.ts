// import * as dotenv from "dotenv";
import "dotenv/config";
import { Telegraf } from "telegraf";

// dotenv.config();
const TOKEN = process.env.BOT_TOKEN;

export const bot = new Telegraf(TOKEN ? TOKEN : "");
