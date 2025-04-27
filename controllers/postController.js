import Product from "../models/Product.js";
import mongoose from "mongoose";

export const addPost = async (req, res) => {

    try {
    const {
      title,
      slug,
      description,
      specification,
      status,
      image,
      brochure,
      category,
      price,
      discount,
      discountAmount,
      featured,
      newlyArrived,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !status || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate `category` as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // await connectToMongoDB();

    // Create a new product
    const newProduct = new Product({
      title,
      slug,
      specification,
      description,
      status,
      image,
      brochure,
      category,
      price,
      discount,
      discountAmount,
      featured,
      newlyArrived,
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
