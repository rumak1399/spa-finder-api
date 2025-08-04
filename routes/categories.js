import express from "express";
import { check } from "express-validator";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getUniqueRootCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { authorize, protect } from "../middleware/auth.js";
const router = express.Router();
// Get all categories

// Create category - protected & restricted to admin
router.post("/", createCategory);
router.get("/all", getCategories);
router.delete("/:id", deleteCategory);
router.get("/rootCategories", getUniqueRootCategories);
router.put("/update/:id", updateCategory);

export default router;
