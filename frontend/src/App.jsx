import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import MyCars from './pages/dashboard/MyCars'
import Favorites from './pages/dashboard/Favorites'
import AdminPanel from './pages/admin/AdminPanel'
import CarDetails from './pages/CarDetails'
import CreateCar from './pages/dashboard/CreateCar'
import EditCar from './pages/dashboard/EditCar'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/my-cars" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <MyCars />
            </ProtectedRoute>
          } />
          
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          
          <Route path="/create-car" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <CreateCar />
            </ProtectedRoute>
          } />
          
          <Route path="/edit-car/:id" element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <EditCar />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App