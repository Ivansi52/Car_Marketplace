const express = require('express');
const { body } = require('express-validator');
const { getAllCars, getCarById, createCar, updateCar, deleteCar, getMyCars, addToFavorites, removeFromFavorites, getFavorites } = require('../controllers/carController');
const { authMiddleware, roleMiddleware, optionalAuth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const createCarValidation = [
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative integer'),
  body('fuelType')
    .isIn(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .isIn(['MANUAL', 'AUTOMATIC', 'CVT'])
    .withMessage('Invalid transmission type'),
  body('engineSize')
    .optional()
    .isFloat({ min: 0.5, max: 10.0 })
    .withMessage('Engine size must be between 0.5 and 10.0'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color must be less than 30 characters'),
  body('bodyType')
    .optional()
    .isIn(['SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'WAGON', 'PICKUP', 'VAN'])
    .withMessage('Invalid body type'),
  body('doors')
    .optional()
    .isInt({ min: 2, max: 5 })
    .withMessage('Doors must be between 2 and 5'),
  body('seats')
    .optional()
    .isInt({ min: 2, max: 9 })
    .withMessage('Seats must be between 2 and 9'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
];

const updateCarValidation = [
  body('brand')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Brand cannot be empty'),
  body('model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Model cannot be empty'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative integer'),
  body('fuelType')
    .optional()
    .isIn(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .optional()
    .isIn(['MANUAL', 'AUTOMATIC', 'CVT'])
    .withMessage('Invalid transmission type'),
  body('engineSize')
    .optional()
    .isFloat({ min: 0.5, max: 10.0 })
    .withMessage('Engine size must be between 0.5 and 10.0'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color must be less than 30 characters'),
  body('bodyType')
    .optional()
    .isIn(['SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'WAGON', 'PICKUP', 'VAN'])
    .withMessage('Invalid body type'),
  body('doors')
    .optional()
    .isInt({ min: 2, max: 5 })
    .withMessage('Doors must be between 2 and 5'),
  body('seats')
    .optional()
    .isInt({ min: 2, max: 9 })
    .withMessage('Seats must be between 2 and 9'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
];

// Public routes
router.get('/', optionalAuth, getAllCars);
router.get('/:id', optionalAuth, getCarById);

// Protected routes
router.post('/', authMiddleware, roleMiddleware('seller', 'admin'), upload.array('images', 10), createCarValidation, handleUploadError, createCar);
router.put('/:id', authMiddleware, upload.array('images', 10), updateCarValidation, handleUploadError, updateCar);
router.delete('/:id', authMiddleware, deleteCar);

// User-specific routes
router.get('/my/list', authMiddleware, getMyCars);
router.post('/:carId/favorite', authMiddleware, addToFavorites);
router.delete('/:carId/favorite', authMiddleware, removeFromFavorites);
router.get('/my/favorites', authMiddleware, getFavorites);

module.exports = router;