import express from "express";
import { addTag } from "../controllers/tagController.js";
const router = express.Router();

router.post("/", addTag);

export default router;
