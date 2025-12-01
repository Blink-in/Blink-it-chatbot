import dotenv from "dotenv";
dotenv.config();
import TelegramBot from "node-telegram-bot-api";
import User from "../models/user.js"
import { randomMatch } from "../utils/matching.js";
import { getRandomAd } from "../utils/ads.js";


const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Create user if new
  let user = await User.findOne({ telegramId: chatId });
  if (!user) {
    user = await User.create({ telegramId: chatId });
    return bot.sendMessage(chatId, "Welcome! Send /random to start chatting.");
  }

  // /random command
  if (text === "/random") {
    const ad = await getRandomAd();
    if (ad && !user.premium) bot.sendMessage(chatId, `AD: ${ad}`);

    const partner = await randomMatch(chatId);
    if (!partner)
      return bot.sendMessage(chatId, "No user found, try again later.");

    bot.sendMessage(chatId, "Matched! Start chatting.");
    bot.sendMessage(partner.telegramId, "Matched! Start chatting.");
    return;
  }

  // Forward messages to partner
  if (user.partner) {
    bot.sendMessage(user.partner, text);
  }
});

console.log("Telegram bot running...");

export default bot;