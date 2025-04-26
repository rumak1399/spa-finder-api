const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Update user profile
router.put(
'/profile',
[
protect,
[
  check('name', 'Name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail()
]
],
userController.updateProfile
);

// Change password
router.put(
'/password',
[
protect,
[
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
]
],
userController.changePassword
);

// Add service to favorites
router.put('/favorites/:serviceId', protect, userController.addFavorite);

// Remove service from favorites
router.delete('/favorites/:serviceId', protect, userController.removeFavorite);

// Get user favorites
router.get('/favorites', protect, userController.getFavorites);

// Admin routes
// Get all users - admin only
router.get('/', [protect, authorize('admin')], userController.getUsers);

// Get user by ID - admin only
router.get('/:id', [protect, authorize('admin')], userController.getUserById);

// Update user - admin only
router.put('/:id', [protect, authorize('admin')], userController.updateUser);

// Delete user - admin only
router.delete('/:id', [protect, authorize('admin')], userController.deleteUser);

module.exports = router;
