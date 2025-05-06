import express from "express";
import { addPost, getPosts, getPostsByCategory } from "../controllers/postController.js";

const router = express.Router();

router.post("/", addPost);

router.get("/getposts", getPosts);

router.get("/getpostsbycategory/:id", getPostsByCategory);

export default router;