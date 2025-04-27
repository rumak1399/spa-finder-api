import express from "express";
import { addPost } from "../controllers/postController";

const router = express.Router();

router.post("/", addPost);

export default router;