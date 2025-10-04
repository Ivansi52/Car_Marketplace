import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MY_FAVORITES, REMOVE_FROM_FAVORITES } from '../../services/queries'
import { Link } from 'react-router-dom'
import { Heart, Eye, Car, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Favorites = () => {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, loading, error, refetch } = useQuery(GET_MY_FAVORITES, {
    variables: { page, limit },
  })

  const [removeFromFavorites] = useMutation(REMOVE_FROM_FAVORITES, {
    onCompleted: () => {
      toast.success('Removed from favorites')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleRemoveFavorite = async (carId) => {
    if (window.confirm('Remove this car from favorites?')) {
      await removeFromFavorites({ variables: { carId } })
    }
  }

  const cars = data?.myFavorites?.cars || []
  const pagination = data?.myFavorites?.pagination

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
          <p className="text-red-600 mb-4">Error loading favorites: {error.message}</p>
          <button onClick={() => refetch()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="mt-2 text-gray-600">
            Cars you've saved for later
          </p>
        </div>

        {/* Favorites Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start browsing cars and add them to your favorites.</p>
            <Link to="/" className="btn btn-primary">
              Browse Cars
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${car.images[0]}`}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleRemoveFavorite(car.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {car.brand} {car.model}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p>{car.year} • {car.mileage.toLocaleString()} km</p>
                      <p className="font-semibold text-green-600">
                        ${car.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Seller: {car.seller.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{car.views} views</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/cars/${car.id}`}
                          className="btn btn-primary text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites