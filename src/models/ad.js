import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  text: String,
  active: { type: Boolean, default: true },
});

// Prevent OverwriteModelError
const Ad = mongoose.models.Ad || mongoose.model("Ad", adSchema);

export default Ad;
