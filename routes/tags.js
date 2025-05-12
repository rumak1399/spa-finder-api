import express from "express";
import { addTag } from "../controllers/tagController";
const router = express.Router();

router.post("/", addTag);

export default router;
