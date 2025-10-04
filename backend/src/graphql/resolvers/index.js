const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Car, Favorite } = require('../../models');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const resolvers = {
  Query: {
    // Cars queries
    cars: async (_, { page = 1, limit = 12, filters = {}, sortBy = 'createdAt', sortOrder = 'DESC' }, { req }) => {
      const offset = (page - 1) * limit;
      const whereClause = { isActive: true };

      // Apply filters
      if (filters.brand) whereClause.brand = { [Op.iLike]: `%${filters.brand}%` };
      if (filters.model) whereClause.model = { [Op.iLike]: `%${filters.model}%` };
      if (filters.fuelType) whereClause.fuelType = filters.fuelType;
      if (filters.transmission) whereClause.transmission = filters.transmission;
      if (filters.bodyType) whereClause.bodyType = filters.bodyType;
      if (filters.location) whereClause.location = { [Op.iLike]: `%${filters.location}%` };

      // Price range
      if (filters.minPrice || filters.maxPrice) {
        whereClause.price = {};
        if (filters.minPrice) whereClause.price[Op.gte] = filters.minPrice;
        if (filters.maxPrice) whereClause.price[Op.lte] = filters.maxPrice;
      }

      // Year range
      if (filters.minYear || filters.maxYear) {
        whereClause.year = {};
        if (filters.minYear) whereClause.year[Op.gte] = filters.minYear;
        if (filters.maxYear) whereClause.year[Op.lte] = filters.maxYear;
      }

      // Mileage range
      if (filters.minMileage || filters.maxMileage) {
        whereClause.mileage = {};
        if (filters.minMileage) whereClause.mileage[Op.gte] = filters.minMileage;
        if (filters.maxMileage) whereClause.mileage[Op.lte] = filters.maxMileage;
      }

      // Search
      if (filters.search) {
        whereClause[Op.or] = [
          { brand: { [Op.iLike]: `%${filters.search}%` } },
          { model: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } },
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

      return {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      };
    },

    car: async (_, { id }, { req }) => {
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

      if (car) {
        await car.increment('views');
      }

      return car;
    },

    myCars: async (_, { page = 1, limit = 10 }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

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

      return {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      };
    },

    myFavorites: async (_, { page = 1, limit = 10 }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

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

      return {
        cars,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      };
    },

    // Users queries
    users: async (_, { page = 1, limit = 10, role, search }, { req }) => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const offset = (page - 1) * limit;
      const whereClause = {};
      if (role) whereClause.role = role;
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] },
      });

      return {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      };
    },

    user: async (_, { id }, { req }) => {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Car,
            as: 'cars',
            where: { isActive: true },
            required: false,
          },
        ],
      });

      return user;
    },

    me: async (_, __, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }
      return req.user;
    },

    // Analytics
    carStats: async () => {
      const totalCars = await Car.count({ where: { isActive: true } });
      const totalViews = await Car.sum('views', { where: { isActive: true } }) || 0;
      const averagePrice = await Car.findOne({
        attributes: [[Car.sequelize.fn('AVG', Car.sequelize.col('price')), 'avgPrice']],
        where: { isActive: true },
        raw: true,
      });

      // Group by fuel type
      const fuelTypeStats = await Car.findAll({
        attributes: [
          'fuelType',
          [Car.sequelize.fn('COUNT', Car.sequelize.col('fuelType')), 'count'],
        ],
        where: { isActive: true },
        group: ['fuelType'],
        raw: true,
      });

      // Group by transmission
      const transmissionStats = await Car.findAll({
        attributes: [
          'transmission',
          [Car.sequelize.fn('COUNT', Car.sequelize.col('transmission')), 'count'],
        ],
        where: { isActive: true },
        group: ['transmission'],
        raw: true,
      });

      // Group by body type
      const bodyTypeStats = await Car.findAll({
        attributes: [
          'bodyType',
          [Car.sequelize.fn('COUNT', Car.sequelize.col('bodyType')), 'count'],
        ],
        where: { isActive: true },
        group: ['bodyType'],
        raw: true,
      });

      return {
        totalCars,
        totalViews,
        averagePrice: parseFloat(averagePrice?.avgPrice || 0),
        carsByFuelType: fuelTypeStats.map(stat => ({
          fuelType: stat.fuelType,
          count: parseInt(stat.count),
        })),
        carsByTransmission: transmissionStats.map(stat => ({
          transmission: stat.transmission,
          count: parseInt(stat.count),
        })),
        carsByBodyType: bodyTypeStats.map(stat => ({
          bodyType: stat.bodyType,
          count: parseInt(stat.count),
        })),
      };
    },

    userStats: async () => {
      const totalUsers = await User.count();
      const totalSellers = await User.count({ where: { role: 'seller' } });
      const totalBuyers = await User.count({ where: { role: 'buyer' } });
      const activeUsers = await User.count({ where: { isActive: true } });

      return {
        totalUsers,
        totalSellers,
        totalBuyers,
        activeUsers,
      };
    },
  },

  Mutation: {
    // Auth mutations
    register: async (_, { input }) => {
      const { name, email, password, role = 'buyer', phone } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        role,
        phone,
      });

      const token = generateToken(user.id);

      return {
        user: user.toJSON(),
        token,
      };
    },

    login: async (_, { input }) => {
      const { email, password } = input;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      const token = generateToken(user.id);

      return {
        user: user.toJSON(),
        token,
      };
    },

    logout: async (_, __, { req }) => {
      // In a more sophisticated implementation, you might want to blacklist the token
      return true;
    },

    // Car mutations
    createCar: async (_, { input }, { req }) => {
      if (!req.user || !['seller', 'admin'].includes(req.user.role)) {
        throw new Error('Seller or admin access required');
      }

      const car = await Car.create({
        ...input,
        sellerId: req.user.id,
      });

      return await Car.findByPk(car.id, {
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'email', 'phone'],
          },
        ],
      });
    },

    updateCar: async (_, { id, input }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const car = await Car.findByPk(id);
      if (!car) {
        throw new Error('Car not found');
      }

      // Check permissions
      if (car.sellerId !== req.user.id && req.user.role !== 'admin') {
        throw new Error('Not authorized to update this car');
      }

      await car.update(input);

      return await Car.findByPk(car.id, {
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'email', 'phone'],
          },
        ],
      });
    },

    deleteCar: async (_, { id }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const car = await Car.findByPk(id);
      if (!car) {
        throw new Error('Car not found');
      }

      // Check permissions
      if (car.sellerId !== req.user.id && req.user.role !== 'admin') {
        throw new Error('Not authorized to delete this car');
      }

      await car.update({ isActive: false });
      return true;
    },

    // Favorite mutations
    addToFavorites: async (_, { carId }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      // Check if car exists
      const car = await Car.findByPk(carId);
      if (!car) {
        throw new Error('Car not found');
      }

      // Check if already in favorites
      const existingFavorite = await Favorite.findOne({
        where: { userId: req.user.id, carId },
      });

      if (existingFavorite) {
        throw new Error('Car already in favorites');
      }

      await Favorite.create({ userId: req.user.id, carId });
      return true;
    },

    removeFromFavorites: async (_, { carId }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      const favorite = await Favorite.findOne({
        where: { userId: req.user.id, carId },
      });

      if (!favorite) {
        throw new Error('Car not found in favorites');
      }

      await favorite.destroy();
      return true;
    },

    // User mutations
    updateProfile: async (_, { input }, { req }) => {
      if (!req.user) {
        throw new Error('Authentication required');
      }

      await req.user.update(input);
      return req.user;
    },
  },
};

module.exports = { resolvers };