const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const serviceController = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/auth");

// Get all services
router.get("/", serviceController.getServices);

// Get single service
router.get("/:id", serviceController.getService);

// Create service - protected & restricted to providers and admins
router.post(
  "/",
  [
    protect,
    authorize("provider", "admin"),
    [
      check("name", "Name is required").not().isEmpty(),
      check("category", "Category is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("priceRange", "Price range is required").not().isEmpty(),
      check("duration", "Duration is required").not().isEmpty(),
      check("location", "Location is required").not().isEmpty(),
    ],
  ],
  serviceController.createService
);

// Update service - protected & restricted to owner or admin
router.put(
  "/:id",
  [protect, authorize("provider", "admin")],
  serviceController.updateService
);

// Delete service - protected & restricted to owner or admin
router.delete(
  "/:id",
  [protect, authorize("provider", "admin")],
  serviceController.deleteService
);

// Add review - protected
router.post(
  "/:id/reviews",
  [
    protect,
    [
      check("rating", "Rating is required").isNumeric(),
      check("rating", "Rating must be between 1 and 5").isFloat({
        min: 1,
        max: 5,
      }),
    ],
  ],
  serviceController.addReview
);

// Get all categories
router.get("/categories/all", serviceController.getCategories);

// Create category - protected & restricted to admin
router.post(
  "/categories",
  [
    protect,
    authorize("admin"),
    [
      check("name", "Name is required").not().isEmpty(),
      check("icon", "Icon is required").not().isEmpty(),
    ],
  ],
  serviceController.createCategory
);

module.exports = router;
