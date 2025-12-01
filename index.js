import express from "express";
import dotenv from "dotenv";
dotenv.config();


import { connectDB } from "./src/db/connect.js";
import TelegramBot from "node-telegram-bot-api"; 
import telbot from "./src/bot/bot.js"; // Start Telegram bot

import adminRoutes from "./src/routes/admin.route.js"
import interestRoutes from "./src/routes/interests.route.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/interest", interestRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Telegram Anonymous Chat API Running...");
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
  });
});
