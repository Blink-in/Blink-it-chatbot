
import User from "../models/user.js";

export const randomMatch = async (userId) => {
  const user = await User.findOne({ telegramId: userId });
  const partner = await User.findOne({
    telegramId: { $ne: userId },
    status: "idle",
  });

  if (!partner) return null;

  user.partner = partner.telegramId;
  partner.partner = user.telegramId;
  user.status = partner.status = "chatting";

  await user.save();
  await partner.save();

  return partner;
};
