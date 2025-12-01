
// import TelegramBot from "node-telegram-bot-api";

// import { randomMatch } from "../utils/matching.js";
// import { getRandomAd } from "../utils/ads.js";


// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;

//   // Create user if new
//   let user = await User.findOne({ telegramId: chatId });
//   if (!user) {
//     user = await User.create({ telegramId: chatId });
//     return bot.sendMessage(chatId, "Welcome! Send /random to start chatting.");
//   }

//   // /random command
//   if (text === "/random") {
//     const ad = await getRandomAd();
//     if (ad && !user.premium) bot.sendMessage(chatId, `AD: ${ad}`);

//     const partner = await randomMatch(chatId);
//     if (!partner)
//       return bot.sendMessage(chatId, "No user found, try again later.");

//     bot.sendMessage(chatId, "Matched! Start chatting.");
//     bot.sendMessage(partner.telegramId, "Matched! Start chatting.");
//     return;
//   }

//   // Forward messages to partner
//   if (user.partner) {
//     bot.sendMessage(user.partner, text);
//   }
// });

// console.log("Telegram bot running...");

// export default bot;

// ...existing code...






import dotenv from "dotenv";
 dotenv.config();
// import TelegramBot from "node-telegram-bot-api";
// import User from "../models/user.js";
// import { randomMatch } from "../utils/matching.js";
// import { getRandomAd } from "../utils/ads.js";

// const token = process.env.BOT_TOKEN;
// if (!token) {
//   console.error("Missing BOT_TOKEN in environment");
//   process.exit(1);
// }
// const bot = new TelegramBot(token, { polling: true });

// async function endChat(user) {
//   if (!user?.partner) return;

//   const partner = await User.findOne({ telegramId: user.partner });
//   if (partner) {
//     partner.partner = null;
//     partner.status = "idle";
//     await partner.save();
//     await bot.sendMessage(partner.telegramId, "Your partner left the chat.");
//   }

//   user.partner = null;
//   user.status = "idle";
//   await user.save();
// }

// bot.on("message", async (msg) => {
//   const chatId = String(msg.chat.id);
//   const text = msg.text ?? "";

//   // use model User (not instance)
//   let user = await User.findOne({ telegramId: chatId });
//   if (!user) {
//     user = await User.create({ telegramId: chatId, status: "idle" });
//     return bot.sendMessage(chatId, "Welcome! Send /random to start chatting.");
//   }

//   if (text === "/stop") {
//     await endChat(user);
//     return bot.sendMessage(chatId, "Chat ended. Send /random to find a new partner.");
//   }

//   if (text === "/skip") {
//     await endChat(user);
//     await bot.sendMessage(chatId, "Finding a new partner...");

//     const partner = await randomMatch(chatId);
//     if (!partner) return bot.sendMessage(chatId, "No users available right now.");

//     // link users
//     user.partner = partner.telegramId;
//     user.status = "chatting";
//     await user.save();

//     partner.partner = chatId;
//     partner.status = "chatting";
//     await partner.save();

//     await bot.sendMessage(chatId, "New partner found!");
//     await bot.sendMessage(partner.telegramId, "New partner found!");
//     return;
//   }

//   if (text === "/random") {
//     if (user.partner) {
//       return bot.sendMessage(chatId, "You're already chatting. Use /skip or /stop.");
//     }

//     const ad = await getRandomAd();
//     if (ad && !user.premium) await bot.sendMessage(chatId, `AD: ${ad}`);

//     await bot.sendMessage(chatId, "Searching for a partner...");

//     const partner = await randomMatch(chatId);
//     if (!partner) return bot.sendMessage(chatId, "No users available right now.");

//     // link users
//     user.partner = partner.telegramId;
//     user.status = "chatting";
//     await user.save();

//     partner.partner = chatId;
//     partner.status = "chatting";
//     await partner.save();

//     await bot.sendMessage(chatId, "Matched! Start chatting.");
//     await bot.sendMessage(partner.telegramId, "Matched! Start chatting.");
//     return;
//   }

//   // Forward messages during chat
//   if (user.partner) {
//     if (!text) return;
//     return bot.sendMessage(user.partner, text);
//   }

//   await bot.sendMessage(chatId, "Send /random to find a partner.");
// });

// console.log("Telegram bot running...");
// export default bot;




import TelegramBot from "node-telegram-bot-api";
import User from "../models/user.js";
import { randomMatch } from "../utils/matching.js";
import { getRandomAd } from "../utils/ads.js";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

async function endChat(user) {
  if (!user.partner) return;

  const partner = await User.findOne({ telegramId: user.partner });
  if (partner) {
    partner.partner = null;
    partner.status = "idle";
    await partner.save();
    bot.sendMessage(partner.telegramId, "Your partner left the chat.");
  }

  user.partner = null;
  user.status = "idle";
  await user.save();
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Find or create user
  let user = await User.findOne({ telegramId: chatId });
  if (!user) {
    user = await User.create({ telegramId: chatId });
    return bot.sendMessage(chatId,
      "Welcome to BlinkIt Anonymous Chat! 👋\n\n" +
      "Let's set up your profile:\n" +
      "Send your *gender* (male, female, other)"
    );
  }

  // PROFILE SETUP — GENDER
  if (!user.gender || user.gender === "other") {
    if (["male", "female", "other"].includes(text.toLowerCase())) {
      user.gender = text.toLowerCase();
      await user.save();
      return bot.sendMessage(chatId,
        "Great! What gender are you looking for?\n(male, female, any)"
      );
    } else {
      return bot.sendMessage(chatId, "Please type: male, female, or other");
    }
  }

  // PROFILE SETUP — LOOKING FOR
  if (!user.lookingFor || user.lookingFor === "any") {
    if (["male", "female", "any"].includes(text.toLowerCase())) {
      user.lookingFor = text.toLowerCase();
      await user.save();
      return bot.sendMessage(chatId,
        "Nice! Now send me your interests separated by commas.\nExample:\nmovies, football, coding"
      );
    } else {
      return bot.sendMessage(chatId, "Type: male, female, or any");
    }
  }

  // PROFILE SETUP — INTERESTS
  if (user.interests.length === 0) {
    user.interests = text.toLowerCase().split(",").map(i => i.trim());
    await user.save();
    return bot.sendMessage(chatId,
      "Profile saved! 🎉\n\n" +
      "Use /random to find a match.\nUse /skip or /stop anytime."
    );
  }

  // COMMANDS
  if (text === "/stop") {
    await endChat(user);
    return bot.sendMessage(chatId, "Chat ended. Send /random to find a new partner.");
  }

  if (text === "/skip") {
    await endChat(user);
    bot.sendMessage(chatId, "Searching for a new partner...");

    const partner = await randomMatch(chatId);
    if (!partner) return bot.sendMessage(chatId, "No available partners right now.");

    bot.sendMessage(chatId, "New partner found!");
    bot.sendMessage(partner.telegramId, "New partner found!");
    return;
  }

  if (text === "/random") {
    user.status = "searching";
    await user.save();

    const ad = await getRandomAd();
    if (ad && !user.premium) bot.sendMessage(chatId, `AD: ${ad}`);

    bot.sendMessage(chatId, "Looking for partners based on gender + interests...");

    const partner = await randomMatch(chatId);
    if (!partner) return bot.sendMessage(chatId, "Still searching...");

    bot.sendMessage(chatId, "Matched! Start talking.");
    bot.sendMessage(partner.telegramId, "Matched! Start talking.");
    return;
  }

  // Forward chat messages
  if (user.partner) {
    return bot.sendMessage(user.partner, text);
  }

  bot.sendMessage(chatId, "Send /random to find a partner.");
});

console.log("Bot running...");
export default bot;