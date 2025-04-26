const Service = require('../models');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const { category, search, lat, lng, distance, sort, page = 1, limit = 10 } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by location (if lat, lng and distance provided)
    if (lat && lng && distance) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance) * 1000 // convert km to meters
        }
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { 'priceRange.min': 1 };
    } else if (sort === 'price-high') {
      sortOption = { 'priceRange.min': -1 };
    } else if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else {
      // Default sort by creation date
      sortOption = { created: -1 };
    }

    const services = await Service.find(query)
      .populate('category', 'name icon')
      .populate('provider', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      count: services.length,
      total: total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: services
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('category', 'name icon')
      .populate('provider', 'name email phone')
      .populate('ratings.user', 'name');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Provider/Admin)
exports.createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      category,
      description,
      image,
      location,
      priceRange,
      duration,
      availability
    } = req.body;

    const newService = new Service({
      name,
      provider: req.user.id,
      category,
      description,
      image,
      location,
      priceRange,
      duration,
      availability
    });

    const service = await newService.save();

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider/Admin)
exports.updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Make sure user is service owner or admin
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: service
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider/Admin)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Make sure user is service owner or admin
    if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await service.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add rating/review to service
// @route   POST /api/services/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rating, review } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user already reviewed this service
    const alreadyReviewed = service.ratings.find(
      r => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Service already reviewed'
      });
    }

    const newReview = {
      user: req.user.id,
      rating: Number(rating),
      review
    };

    service.ratings.push(newReview);
    await service.save();

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/services/categories
// @access  Public
exports.getCategories = async (req, res) => {
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

// @desc    Create new category
// @route   POST /api/services/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, icon, description } = req.body;

    // Check if category already exists
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
