import Ad from "../models/ad.js";

export const getRandomAd = async () => {
  const ads = await Ad.find({ active: true });
  if (!ads.length) return null;
  return ads[Math.floor(Math.random() * ads.length)].text;
};
