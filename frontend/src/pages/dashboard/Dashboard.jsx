import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@apollo/client'
import { GET_ME, GET_MY_CARS, GET_MY_FAVORITES } from '../../services/queries'
import { Car, Heart, Users, TrendingUp, Calendar } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  
  const { data: userData } = useQuery(GET_ME)
  const { data: carsData } = useQuery(GET_MY_CARS, {
    variables: { page: 1, limit: 5 }
  })
  const { data: favoritesData } = useQuery(GET_MY_FAVORITES, {
    variables: { page: 1, limit: 5 }
  })

  const myCars = carsData?.myCars?.cars || []
  const myFavorites = favoritesData?.myFavorites?.cars || []

  const stats = [
    {
      name: 'My Cars',
      value: myCars.length,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Favorites',
      value: myFavorites.length,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'Total Views',
      value: myCars.reduce((sum, car) => sum + car.views, 0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Member Since',
      value: userData?.me?.createdAt ? new Date(userData.me.createdAt).getFullYear() : 'N/A',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your car marketplace activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Cars */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">My Recent Cars</h2>
                <a
                  href="/my-cars"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all
                </a>
              </div>
            </div>
            <div className="p-6">
              {myCars.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No cars listed yet</p>
                  <a
                    href="/create-car"
                    className="btn btn-primary"
                  >
                    List Your First Car
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {myCars.map((car) => (
                    <div key={car.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000/uploads/${car.images[0]}`}
                          alt={`${car.brand} ${car.model}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.year} • {car.mileage.toLocaleString()} km
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          ${car.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{car.views} views</p>
                        <p className={`text-xs px-2 py-1 rounded-full ${
                          car.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {car.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">My Favorites</h2>
                <a
                  href="/favorites"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all
                </a>
              </div>
            </div>
            <div className="p-6">
              {myFavorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No favorites yet</p>
                  <a
                    href="/"
                    className="btn btn-primary"
                  >
                    Browse Cars
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {myFavorites.map((car) => (
                    <div key={car.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000/uploads/${car.images[0]}`}
                          alt={`${car.brand} ${car.model}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.year} • {car.mileage.toLocaleString()} km
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          ${car.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{car.views} views</p>
                        <a
                          href={`/cars/${car.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/create-car"
              className="btn btn-primary text-center"
            >
              List New Car
            </a>
            <a
              href="/my-cars"
              className="btn btn-secondary text-center"
            >
              Manage My Cars
            </a>
            <a
              href="/"
              className="btn btn-secondary text-center"
            >
              Browse All Cars
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard