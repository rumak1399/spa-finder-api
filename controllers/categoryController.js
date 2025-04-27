import Category from "../models/Category.js";

// @desc    Create new category
// @route   POST /api/services/categories
// @access  Private (Admin)

export const createCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { name, icon, description } = req.body;
  
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category already exists'
        });
      }
  
      const newCategory = new Category({
        name,
        icon,
        description
      });
  
      const category = await newCategory.save();
  
      res.status(201).json({
        success: true,
        data: category
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
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
        data: categories
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
  
