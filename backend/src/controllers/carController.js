const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Car, User, Favorite } = require('../models');

const getAllCars = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      brand,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      fuelType,
      transmission,
      bodyType,
      minMileage,
      maxMileage,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Apply filters
    if (brand) whereClause.brand = { [Op.iLike]: `%${brand}%` };
    if (model) whereClause.model = { [Op.iLike]: `%${model}%` };
    if (fuelType) whereClause.fuelType = fuelType;
    if (transmission) whereClause.transmission = transmission;
    if (bodyType) whereClause.bodyType = bodyType;
    if (location) whereClause.location = { [Op.iLike]: `%${location}%` };

    // Price range
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    // Year range
    if (minYear || maxYear) {
      whereClause.year = {};
      if (minYear) whereClause.year[Op.gte] = parseInt(minYear);
      if (maxYear) whereClause.year[Op.lte] = parseInt(maxYear);
    }

    // Mileage range
    if (minMileage || maxMileage) {
      whereClause.mileage = {};
      if (minMileage) whereClause.mileage[Op.gte] = parseInt(minMileage);
      if (maxMileage) whereClause.mileage[Op.lte] = parseInt(maxMileage);
    }

    // Search
    if (search) {
      whereClause[Op.or] = [
        { brand: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: cars } = await Car.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'phone', 'avatar'],
        },
      ],
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Increment view count
    await car.increment('views');

    res.json({
      success: true,
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

const createCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const carData = {
      ...req.body,
      sellerId: req.user.id,
      images: req.files ? req.files.map(file => file.filename) : [],
    };

    const car = await Car.create(carData);

    const carWithSeller = await Car.findByPk(car.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: { car: carWithSeller },
    });
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check permissions
    if (car.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this car',
      });
    }

    // Handle image updates
    let images = car.images || [];
    if (req.files && req.files.length > 0) {
      images = [...images, ...req.files.map(file => file.filename)];
    }

    const updateData = {
      ...req.body,
      images,
    };

    await car.update(updateData);

    const updatedCar = await Car.findByPk(car.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: { car: updatedCar },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check permissions
    if (car.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this car',
      });
    }

    // Soft delete
    await car.update({ isActive: false });

    res.json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getMyCars = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: cars } = await Car.findAndCountAll({
      where: { sellerId: req.user.id },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const addToFavorites = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    // Check if car exists
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: { userId, carId },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Car already in favorites',
      });
    }

    await Favorite.create({ userId, carId });

    res.json({
      success: true,
      message: 'Car added to favorites',
    });
  } catch (error) {
    next(error);
  }
};

const removeFromFavorites = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      where: { userId, carId },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Car not found in favorites',
      });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: 'Car removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: favorites } = await Favorite.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Car,
          as: 'favoriteCars',
          where: { isActive: true },
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'name', 'email', 'phone'],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    const cars = favorites.map(fav => fav.favoriteCars).filter(Boolean);

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};