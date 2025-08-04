import mongoose from "mongoose";
import Category from "../models/Category.js";

export const createCategory = async (req, res) => {

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  try {
    const { name, icon, description, root } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({
      name,
      icon,
      description,
      root,
    });

    const category = await newCategory.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all categories
// @route   GET /api/services/categories

// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getCategoriesWithRoot = async (req, res) => {
//   try {
//     const categories = await Category.find({
//       root: { $exists: true, $ne: "" },
//     });

//     if (categories.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No categories with rootCategory found" });
//     }

//     res.status(200).json(categories);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getUniqueRootCategories = async (req, res) => {
  try {
    const uniqueRoots = await Category.distinct("root", {
      root: { $exists: true, $ne: "" },
    });

    if (uniqueRoots.length === 0) {
      return res.status(404).json({ message: "No root categories found" });
    }

    const formattedRoots = uniqueRoots.map((root) => ({ title: root }));

    res.status(200).json(formattedRoots);
  } catch (error) {
    console.error("Error fetching unique root categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCategory = async (req, res) => {
  const { id } = req.params;
  console.log("hit", id, req.params);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({
      message: "Failed to update category.",
      error: error.message,
    });
  }
};
