const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  enum UserRole {
    ADMIN
    SELLER
    BUYER
  }

  enum FuelType {
    GASOLINE
    DIESEL
    ELECTRIC
    HYBRID
    LPG
  }

  enum Transmission {
    MANUAL
    AUTOMATIC
    CVT
  }

  enum BodyType {
    SEDAN
    SUV
    HATCHBACK
    COUPE
    CONVERTIBLE
    WAGON
    PICKUP
    VAN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    phone: String
    avatar: String
    isActive: Boolean!
    lastLogin: Date
    createdAt: Date!
    updatedAt: Date!
    cars: [Car!]
    favoriteCars: [Car!]
  }

  type Car {
    id: ID!
    brand: String!
    model: String!
    year: Int!
    price: Float!
    mileage: Int!
    fuelType: FuelType!
    transmission: Transmission!
    engineSize: Float
    color: String
    bodyType: BodyType
    doors: Int
    seats: Int
    description: String
    images: [String!]!
    location: String
    isActive: Boolean!
    isFeatured: Boolean!
    views: Int!
    sellerId: ID!
    seller: User!
    createdAt: Date!
    updatedAt: Date!
  }

  type Favorite {
    id: ID!
    userId: ID!
    carId: ID!
    car: Car!
    createdAt: Date!
  }

  type PaginationInfo {
    currentPage: Int!
    totalPages: Int!
    totalItems: Int!
    itemsPerPage: Int!
  }

  type CarsResponse {
    cars: [Car!]!
    pagination: PaginationInfo!
  }

  type UsersResponse {
    users: [User!]!
    pagination: PaginationInfo!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input CarFiltersInput {
    brand: String
    model: String
    minPrice: Float
    maxPrice: Float
    minYear: Int
    maxYear: Int
    fuelType: FuelType
    transmission: Transmission
    bodyType: BodyType
    minMileage: Int
    maxMileage: Int
    location: String
    search: String
  }

  input CreateCarInput {
    brand: String!
    model: String!
    year: Int!
    price: Float!
    mileage: Int!
    fuelType: FuelType!
    transmission: Transmission!
    engineSize: Float
    color: String
    bodyType: BodyType
    doors: Int
    seats: Int
    description: String
    location: String
    images: [String!]
  }

  input UpdateCarInput {
    brand: String
    model: String
    year: Int
    price: Float
    mileage: Int
    fuelType: FuelType
    transmission: Transmission
    engineSize: Float
    color: String
    bodyType: BodyType
    doors: Int
    seats: Int
    description: String
    location: String
    images: [String!]
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: UserRole
    phone: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    # Cars
    cars(
      page: Int
      limit: Int
      filters: CarFiltersInput
      sortBy: String
      sortOrder: String
    ): CarsResponse!
    
    car(id: ID!): Car
    
    myCars(page: Int, limit: Int): CarsResponse!
    
    myFavorites(page: Int, limit: Int): CarsResponse!

    # Users
    users(page: Int, limit: Int, role: UserRole, search: String): UsersResponse!
    
    user(id: ID!): User
    
    me: User

    # Analytics
    carStats: CarStats!
    userStats: UserStats!
  }

  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    logout: Boolean!

    # Cars
    createCar(input: CreateCarInput!): Car!
    updateCar(id: ID!, input: UpdateCarInput!): Car!
    deleteCar(id: ID!): Boolean!
    
    # Favorites
    addToFavorites(carId: ID!): Boolean!
    removeFromFavorites(carId: ID!): Boolean!

    # Users
    updateProfile(input: UpdateProfileInput!): User!
  }

  input UpdateProfileInput {
    name: String
    phone: String
    avatar: String
  }

  type CarStats {
    totalCars: Int!
    totalViews: Int!
    averagePrice: Float!
    carsByFuelType: [FuelTypeCount!]!
    carsByTransmission: [TransmissionCount!]!
    carsByBodyType: [BodyTypeCount!]!
  }

  type UserStats {
    totalUsers: Int!
    totalSellers: Int!
    totalBuyers: Int!
    activeUsers: Int!
  }

  type FuelTypeCount {
    fuelType: FuelType!
    count: Int!
  }

  type TransmissionCount {
    transmission: Transmission!
    count: Int!
  }

  type BodyTypeCount {
    bodyType: BodyType!
    count: Int!
  }
`;

module.exports = { typeDefs };