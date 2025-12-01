import express from "express";
import { stats, addAd, listAds } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", stats);
router.post("/ads", addAd);
router.get("/ads", listAds);

export default router;
