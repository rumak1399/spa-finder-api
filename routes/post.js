import express from "express";
import {
  addPost,
  getPosts,
  getPostsByCategory,
  getPostsByCategoryAndTags,
  getPostsByPopular,
  getPostsbyUserId,
  getSinglePost,
  getPostsByCategorySlug,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", addPost);

router.get("/getposts", getPosts);

router.get("/getpostsbycategory/:id", getPostsByCategory);

router.get("/getpostsbycategory/categoryslug/:slug", getPostsByCategorySlug);

router.get("/getsinglepost/:id", getSinglePost);

router.get("/getpostsbyuserid/:id", getPostsbyUserId);

router.get("/getpostsbycategoryandtags", getPostsByCategoryAndTags);

router.get("/getpostsbypopularity", getPostsByPopular);

export default router;
