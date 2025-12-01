// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   telegramId: { type: String, unique: true, required: true },
//   name: String,
//   gender: String,
//   interests: [String],
//   partner: String,
//   premium: { type: Boolean, default: false },
//   status: { type: String, default: "idle" },
// });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },

  // User profile
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  lookingFor: { type: String, enum: ["male", "female", "other", "any"], default: "any" },
  interests: { type: [String], default: [] },

  // Chat status
  status: { type: String, enum: ["idle", "searching", "chatting"], default: "idle" },
  partner: { type: String, default: null },

  // Monetization
  premium: { type: Boolean, default: false }
});

export default mongoose.model("User", UserSchema);
