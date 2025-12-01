import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true, required: true },
  name: String,
  gender: String,
  interests: [String],
  partner: String,
  premium: { type: Boolean, default: false },
  status: { type: String, default: "idle" },
});

export default mongoose.model("User", userSchema);
