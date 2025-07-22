import mongoose from "mongoose";
import Post from "../models/Post.js";
import State from '../models/State.js'
import City from '../models/City.js'

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
      email,
      phone,
      // location,
      state,
      city,
      address
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
      email,
      phone,
      state,
      city,
      address
    });
    await newProduct.save();
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
    const state = await State.findById(result.state)
    const city = await City.findById(result.city)
    const fullAddress = `${result.address}, ${city.name}, ${state.name}`;
    const plainResult = result.toObject(); // Convert to plain object
    plainResult.fullAddress = fullAddress;
    res.status(200).json(plainResult);
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

// export const getPostsByCategoryAndTags = async(req, res)=>{

//   try {
//     const {categoryId, tags} = req.body;
//     console.log('req body', categoryId, tags, req.body);
//        if (!categoryId || !Array.isArray(tags)) {
//       return res.status(400).json({ message: "Category ID and tags are required." });
//     }

//     const posts = await Post.find({
//       category: categoryId,
//       tags: { $in: tags },
//     });

//     res.status(200).json(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// }

export const getPostsByCategoryAndTags = async (req, res) => {
  try {
    const { categoryId, tags } = req.query;
    console.log("req query", categoryId, tags);

    const tagArray = typeof tags === "string" ? tags.split(",") : [];

    if (!categoryId && tagArray.length === 0) {
      return res
        .status(400)
        .json({ message: "At least categoryId or tags are required." });
    }

    // Build the dynamic filter
    const filter = [];
    if (categoryId) {
      filter.push({ category: categoryId });
    }
    if (tagArray.length > 0) {
      filter.push({ tags: { $in: tagArray } });
    }

    const posts = await Post.find({ $or: filter })
      .populate("review")
      .populate("category");

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const getPostsByPopular = async (req, res) => {
  try {
    const posts = await Post.find({ popular: true })
      .populate("review")
      .populate("category");
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
