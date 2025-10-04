import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CAR, UPDATE_CAR } from '../../services/queries'
import { useForm } from 'react-hook-form'
import { Upload, X, Car, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  const { data, loading, error } = useQuery(GET_CAR, {
    variables: { id },
  })

  const [updateCar, { loading: updating }] = useMutation(UPDATE_CAR, {
    onCompleted: () => {
      toast.success('Car updated successfully!')
      navigate('/my-cars')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const car = data?.car

  useEffect(() => {
    if (car) {
      // Set form values
      Object.keys(car).forEach(key => {
        if (car[key] !== null && car[key] !== undefined) {
          setValue(key, car[key])
        }
      })
      setExistingImages(car.images || [])
    }
  }, [car, setValue])

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (images.length + existingImages.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    const updateData = {
      brand: data.brand,
      model: data.model,
      year: parseInt(data.year),
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage),
      fuelType: data.fuelType,
      transmission: data.transmission,
      engineSize: data.engineSize ? parseFloat(data.engineSize) : null,
      color: data.color || null,
      bodyType: data.bodyType || null,
      doors: data.doors ? parseInt(data.doors) : null,
      seats: data.seats ? parseInt(data.seats) : null,
      description: data.description || null,
      location: data.location || null,
      images: existingImages, // Keep existing images
    }

    try {
      await updateCar({
        variables: {
          id,
          input: updateData
        }
      })
    } catch (error) {
      console.error('Error updating car:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading car: {error.message}</p>
          <button onClick={() => navigate('/my-cars')} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Car not found</p>
          <button onClick={() => navigate('/my-cars')} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/my-cars')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to My Cars
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Car Listing</h1>
          <p className="mt-2 text-gray-600">Update your car information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  {...register('brand', { required: 'Brand is required' })}
                  type="text"
                  className="input"
                  placeholder="e.g., Toyota"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  {...register('model', { required: 'Model is required' })}
                  type="text"
                  className="input"
                  placeholder="e.g., Camry"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  {...register('year', { 
                    required: 'Year is required',
                    min: { value: 1900, message: 'Year must be 1900 or later' },
                    max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
                  })}
                  type="number"
                  className="input"
                  placeholder="2020"
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="25000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage *
                </label>
                <input
                  {...register('mileage', { 
                    required: 'Mileage is required',
                    min: { value: 0, message: 'Mileage must be non-negative' }
                  })}
                  type="number"
                  className="input"
                  placeholder="50000"
                />
                {errors.mileage && (
                  <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="input"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Technical Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  {...register('fuelType', { required: 'Fuel type is required' })}
                  className="input"
                >
                  <option value="">Select fuel type</option>
                  <option value="GASOLINE">Gasoline</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="LPG">LPG</option>
                </select>
                {errors.fuelType && (
                  <p className="mt-1 text-sm text-red-600">{errors.fuelType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission *
                </label>
                <select
                  {...register('transmission', { required: 'Transmission is required' })}
                  className="input"
                >
                  <option value="">Select transmission</option>
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
                {errors.transmission && (
                  <p className="mt-1 text-sm text-red-600">{errors.transmission.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engine Size (L)
                </label>
                <input
                  {...register('engineSize', {
                    min: { value: 0.5, message: 'Engine size must be at least 0.5L' },
                    max: { value: 10.0, message: 'Engine size must be at most 10.0L' }
                  })}
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="2.0"
                />
                {errors.engineSize && (
                  <p className="mt-1 text-sm text-red-600">{errors.engineSize.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  {...register('color')}
                  type="text"
                  className="input"
                  placeholder="e.g., Silver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Type
                </label>
                <select {...register('bodyType')} className="input">
                  <option value="">Select body type</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="COUPE">Coupe</option>
                  <option value="CONVERTIBLE">Convertible</option>
                  <option value="WAGON">Wagon</option>
                  <option value="PICKUP">Pickup</option>
                  <option value="VAN">Van</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doors
                </label>
                <select {...register('doors')} className="input">
                  <option value="">Select doors</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seats
                </label>
                <select {...register('seats')} className="input">
                  <option value="">Select seats</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Images</h2>
            
            <div className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`http://localhost:5000/uploads/${image}`}
                          alt={`Current ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Add more images</p>
                <p className="text-sm text-gray-500 mb-4">Maximum 10 images total</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn btn-primary cursor-pointer"
                >
                  Choose Images
                </label>
              </div>

              {/* New Images Preview */}
              {images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">New Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description', {
                  maxLength: { value: 2000, message: 'Description must be less than 2000 characters' }
                })}
                rows={6}
                className="input"
                placeholder="Describe your car's condition, features, and any additional information..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-cars')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary"
            >
              {updating ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCar