import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  userA: String,
  userB: String,
  active: { type: Boolean, default: true },
});

export default mongoose.model("Match", matchSchema);
