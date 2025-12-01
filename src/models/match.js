// import mongoose from "mongoose";

// const matchSchema = new mongoose.Schema({
//   userA: String,
//   userB: String,
//   active: { type: Boolean, default: true },
// });

// export default mongoose.model("Match", matchSchema);
import User from "../models/user.js";

export async function randomMatch(userId) {
  const user = await User.findOne({ telegramId: userId });
  if (!user) return null;

  // Get all users searching
  const candidates = await User.find({
    telegramId: { $ne: userId },
    status: "searching"
  });

  // Apply gender filter
  const genderFiltered = candidates.filter((u) => {
    const userOK = (user.lookingFor === "any") || (u.gender === user.lookingFor);
    const partnerOK = (u.lookingFor === "any") || (user.gender === u.lookingFor);
    return userOK && partnerOK;
  });

  // Apply interest filter (at least 1 shared interest)
  const interestFiltered = genderFiltered.filter((u) => {
    return u.interests.some(i => user.interests.includes(i));
  });

  // Use interest matches first
  let finalList = interestFiltered.length ? interestFiltered : genderFiltered;

  if (finalList.length === 0) return null;

  // Pick random partner
  const partner = finalList[Math.floor(Math.random() * finalList.length)];

  // Update both users
  user.partner = partner.telegramId;
  partner.partner = user.telegramId;

  user.status = "chatting";
  partner.status = "chatting";

  await user.save();
  await partner.save();

  return partner;
}
