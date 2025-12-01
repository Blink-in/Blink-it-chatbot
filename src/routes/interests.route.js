import express from "express";
import { saveInterests } from "../controllers/interest.controller.js";

const router = express.Router();

router.post("/save", saveInterests);

export default router;
