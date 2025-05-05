import express from "express";
import { addPost, getPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/", addPost);

router.get("/getposts", getPosts)

export default router;