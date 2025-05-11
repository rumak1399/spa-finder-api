import mongoose from "mongoose";
import Post from "../models/Post.js";

export const addPost = async (req, res) => {
  try {
    const {
      title,
      // slug,
      description,
      specification,
      // status,
      image,
      // brochure,
      category,
      price,
      discount,
      discountAmount,
      // featured,
      popular,
      userId,
    } = req.body;

    // Validate required fields
    if (!title || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate `category` as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // await connectToMongoDB();

    // Create a new product
    const newProduct = new Post({
      title,
      // slug,
      specification,
      description,
      // status,
      image,
      // brochure,
      category,
      price,
      discount,
      discountAmount,
      // featured,
      popular,
      userId,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with the created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("category").populate("review"); // Populate category details

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostsByCategory = async (req, res) => {
  console.log("hit");

  try {
    const { id } = req.params;
    console.log("category Id", id);
    const result = await Post.find({ category: id })
      .populate("category")
      .populate("review");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Post.findById(id)
      .populate("review")
      .populate("category");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getPostsbyUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({
      userId: id,
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
