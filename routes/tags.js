import express from "express";
import { addTag, getUniqueTags } from "../controllers/tagController.js";
const router = express.Router();

router.post("/", addTag);
router.get("/getuniquetags", getUniqueTags);

export default router;
