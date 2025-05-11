import express from "express";
import { addPost, getPosts, getPostsByCategory, getPostsbyUserId, getSinglePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", addPost);

router.get("/getposts", getPosts);

router.get("/getpostsbycategory/:id", getPostsByCategory);

router.get("/getsinglepost/:id", getSinglePost);

router.get("/getpostsbyuserid/:id", getPostsbyUserId);

export default router;