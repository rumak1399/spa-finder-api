import { validationResult } from "express-validator";
import User from "../models/User.js";

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Prevent role change through this route
    if (req.body.role) {
      delete req.body.role;
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Add service to favorites
// @route   PUT /api/users/favorites/:serviceId
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if service is already in favorites
    if (user.favorites.includes(req.params.serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Service already in favorites",
      });
    }

    user.favorites.push(req.params.serviceId);
    await user.save();

    res.json({
      success: true,
      data: user.favorites,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Remove service from favorites
// @route   DELETE /api/users/favorites/:serviceId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if service is in favorites
    if (!user.favorites.includes(req.params.serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Service not in favorites",
      });
    }

    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== req.params.serviceId
    );
    await user.save();

    res.json({
      success: true,
      data: user.favorites,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favorites",
      select: "name description image priceRange averageRating",
    });

    res.json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.remove();

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
