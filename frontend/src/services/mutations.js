import { gql } from '@apollo/client'

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