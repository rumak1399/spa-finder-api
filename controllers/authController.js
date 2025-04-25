import User, { findOne, findById } from '../models/User';
import { sign } from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Generate JWT Token
const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET || 'thesecret', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone, role } = req.body;

  try {
    // Check if user already exists
    let user = await findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check for user
    const user = await findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res) {
  try {
    const user = await findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}
