import User from "../models/user.js";
import Ad from "../models/ad.js";

export const stats = async (req, res) => {
  const users = await User.countDocuments();
  res.json({ users });
};

export const addAd = async (req, res) => {
  const ad = await Ad.create({ text: req.body.text });
  res.json({ message: "Ad created", ad });
};

export const listAds = async (req, res) => {
  const ads = await Ad.find();
  res.json(ads);
};
