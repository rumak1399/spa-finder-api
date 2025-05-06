import express from "express";
import { addPost, getPosts, getPostsByCategory, getSinglePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", addPost);

router.get("/getposts", getPosts);

router.get("/getpostsbycategory/:id", getPostsByCategory);

router.get("/getsinglepost/:id", getSinglePost);

export default router;