import { gql } from '@apollo/client'

export const GET_CARS = gql`
  query GetCars($page: Int, $limit: Int, $filters: CarFiltersInput, $sortBy: String, $sortOrder: String) {
    cars(page: $page, limit: $limit, filters: $filters, sortBy: $sortBy, sortOrder: $sortOrder) {
      cars {
        id
        brand
        model
        year
        price
        mileage
        fuelType
        transmission
        engineSize
        color
        bodyType
        doors
        seats
        description
        images
        location
        isActive
        isFeatured
        views
        sellerId
        seller {
          id
          name
          email
          phone
        }
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
      }
    }
  }
`

export const GET_CAR = gql`
  query GetCar($id: ID!) {
    car(id: $id) {
      id
      brand
      model
      year
      price
      mileage
      fuelType
      transmission
      engineSize
      color
      bodyType
      doors
      seats
      description
      images
      location
      isActive
      isFeatured
      views
      sellerId
      seller {
        id
        name
        email
        phone
        avatar
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MY_CARS = gql`
  query GetMyCars($page: Int, $limit: Int) {
    myCars(page: $page, limit: $limit) {
      cars {
        id
        brand
        model
        year
        price
        mileage
        fuelType
        transmission
        engineSize
        color
        bodyType
        doors
        seats
        description
        images
        location
        isActive
        isFeatured
        views
        sellerId
        seller {
          id
          name
          email
        }
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
      }
    }
  }
`

export const GET_MY_FAVORITES = gql`
  query GetMyFavorites($page: Int, $limit: Int) {
    myFavorites(page: $page, limit: $limit) {
      cars {
        id
        brand
        model
        year
        price
        mileage
        fuelType
        transmission
        engineSize
        color
        bodyType
        doors
        seats
        description
        images
        location
        isActive
        isFeatured
        views
        sellerId
        seller {
          id
          name
          email
          phone
        }
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int, $role: UserRole, $search: String) {
    users(page: $page, limit: $limit, role: $role, search: $search) {
      users {
        id
        name
        email
        role
        phone
        avatar
        isActive
        lastLogin
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
      }
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      phone
      avatar
      isActive
      lastLogin
      cars {
        id
        brand
        model
        year
        price
        mileage
        fuelType
        transmission
        images
        isActive
        views
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      phone
      avatar
      isActive
      lastLogin
      createdAt
      updatedAt
    }
  }
`

export const GET_CAR_STATS = gql`
  query GetCarStats {
    carStats {
      totalCars
      totalViews
      averagePrice
      carsByFuelType {
        fuelType
        count
      }
      carsByTransmission {
        transmission
        count
      }
      carsByBodyType {
        bodyType
        count
      }
    }
  }
`

export const GET_USER_STATS = gql`
  query GetUserStats {
    userStats {
      totalUsers
      totalSellers
      totalBuyers
      activeUsers
    }
  }
`

// Mutations
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        role
        phone
        avatar
        isActive
        createdAt
      }
      token
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        role
        phone
        avatar
        isActive
        createdAt
      }
      token
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export const CREATE_CAR = gql`
  mutation CreateCar($input: CreateCarInput!) {
    createCar(input: $input) {
      id
      brand
      model
      year
      price
      mileage
      fuelType
      transmission
      engineSize
      color
      bodyType
      doors
      seats
      description
      images
      location
      isActive
      isFeatured
      views
      sellerId
      seller {
        id
        name
        email
        phone
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $input: UpdateCarInput!) {
    updateCar(id: $id, input: $input) {
      id
      brand
      model
      year
      price
      mileage
      fuelType
      transmission
      engineSize
      color
      bodyType
      doors
      seats
      description
      images
      location
      isActive
      isFeatured
      views
      sellerId
      seller {
        id
        name
        email
        phone
      }
      createdAt
      updatedAt
    }
  }
`

export const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id)
  }
`

export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($carId: ID!) {
    addToFavorites(carId: $carId)
  }
`

export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($carId: ID!) {
    removeFromFavorites(carId: $carId)
  }
`

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      role
      phone
      avatar
      isActive
      lastLogin
      createdAt
      updatedAt
    }
  }
`