import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CAR, ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from '../../services/queries'
import { useAuth } from '../../context/AuthContext'
import { Heart, Phone, Mail, Calendar, Fuel, Cog, MapPin, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)

  const { data, loading, error } = useQuery(GET_CAR, {
    variables: { id },
  })

  const [addToFavorites] = useMutation(ADD_TO_FAVORITES)
  const [removeFromFavorites] = useMutation(REMOVE_FROM_FAVORITES)

  const car = data?.car

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      navigate('/login')
      return
    }

    try {
      if (isFavorite) {
        await removeFromFavorites({ variables: { carId: id } })
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await addToFavorites({ variables: { carId: id } })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error(error.message)
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
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Home
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
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800">
                Home
              </button>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-500">{car.brand} {car.model}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {car.images && car.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/uploads/${image}`}
                      alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">🚗</div>
                    <p>No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Main Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-2xl font-semibold text-green-600">
                    ${car.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Fuel className="h-5 w-5 mr-2" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Cog className="h-5 w-5 mr-2" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Eye className="h-5 w-5 mr-2" />
                  <span>{car.views} views</span>
                </div>
              </div>

              {car.location && (
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{car.location}</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="text-lg font-semibold">{car.mileage.toLocaleString()} km</p>
              </div>

              {car.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{car.description}</p>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{car.seller.name}</p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={`tel:${car.seller.phone}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </a>
                  <a
                    href={`mailto:${car.seller.email}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </a>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {car.engineSize && (
                  <div>
                    <p className="text-sm text-gray-500">Engine Size</p>
                    <p className="font-semibold">{car.engineSize}L</p>
                  </div>
                )}
                {car.color && (
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold">{car.color}</p>
                  </div>
                )}
                {car.bodyType && (
                  <div>
                    <p className="text-sm text-gray-500">Body Type</p>
                    <p className="font-semibold">{car.bodyType}</p>
                  </div>
                )}
                {car.doors && (
                  <div>
                    <p className="text-sm text-gray-500">Doors</p>
                    <p className="font-semibold">{car.doors}</p>
                  </div>
                )}
                {car.seats && (
                  <div>
                    <p className="text-sm text-gray-500">Seats</p>
                    <p className="font-semibold">{car.seats}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails