import User from "../models/user.js";

export const saveInterests = async (req, res) => {
  const { userId, interests } = req.body;

  const user = await User.findOneAndUpdate(
    { telegramId: userId },
    { interests },
    { new: true }
  );

  res.json({ message: "Interests updated", user });
};
