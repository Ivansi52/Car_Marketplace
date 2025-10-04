const User = require('./User');
const Car = require('./Car');
const Favorite = require('./Favorite');

// Define associations
User.hasMany(Car, { foreignKey: 'sellerId', as: 'cars' });
Car.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.belongsToMany(Car, { 
  through: Favorite, 
  foreignKey: 'userId', 
  otherKey: 'carId',
  as: 'favoriteCars' 
});
Car.belongsToMany(User, { 
  through: Favorite, 
  foreignKey: 'carId', 
  otherKey: 'userId',
  as: 'favoritedBy' 
});

module.exports = {
  User,
  Car,
  Favorite,
};