import { Router } from "express";
const router = Router();
import { check } from "express-validator";
import {
  updateProfile,
  changePassword,
  addFavorite,
  removeFavorite,
  getFavorites,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect, authorize } from "../middleware/auth";

// Update user profile
router.put(
  "/profile",
  [
    protect,
    [
      check("name", "Name is required").optional().not().isEmpty(),
      check("email", "Please include a valid email").optional().isEmail(),
    ],
  ],
  updateProfile
);

// Change password
router.put(
  "/password",
  [
    protect,
    [
      check("currentPassword", "Current password is required").not().isEmpty(),
      check(
        "newPassword",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
    ],
  ],
  changePassword
);

// Add service to favorites
router.put("/favorites/:serviceId", protect, addFavorite);

// Remove service from favorites
router.delete("/favorites/:serviceId", protect, removeFavorite);

// Get user favorites
router.get("/favorites", protect, getFavorites);

// Admin routes
// Get all users - admin only
router.get("/", [protect, authorize("admin")], getUsers);

// Get user by ID - admin only
router.get("/:id", [protect, authorize("admin")], getUserById);

// Update user - admin only
router.put("/:id", [protect, authorize("admin")], updateUser);

// Delete user - admin only
router.delete("/:id", [protect, authorize("admin")], deleteUser);

export default router;
