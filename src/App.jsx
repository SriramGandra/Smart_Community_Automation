import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import ResidentDashboard from './pages/ResidentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SecurityDashboard from './pages/SecurityDashboard'
import VisitorEntry from './pages/VisitorEntry'
import VisitorList from './pages/VisitorList'
import VisitorValidation from './pages/VisitorValidation'
import AmenitiesBooking from './pages/AmenitiesBooking'
import BookingHistory from './pages/BookingHistory'
import Announcements from './pages/Announcements'
import SchoolUpdates from './pages/SchoolUpdates'
import Complaints from './pages/Complaints'
import Parking from './pages/Parking'
import CarCleaning from './pages/CarCleaning'
import MaintenancePayments from './pages/MaintenancePayments'
import PaymentHistory from './pages/PaymentHistory'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-container">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}-dashboard`} replace />} />
      
      <Route
        path="/resident-dashboard"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/security-dashboard"
        element={
          <ProtectedRoute allowedRoles={['Security']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/visitor-entry"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <VisitorEntry />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/visitor-list"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <VisitorList />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/visitor-validation"
        element={
          <ProtectedRoute allowedRoles={['Security']}>
            <VisitorValidation />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/amenities-booking"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <AmenitiesBooking />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/booking-history"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/school-updates"
        element={
          <ProtectedRoute>
            <SchoolUpdates />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <Complaints />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/parking"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <Parking />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/car-cleaning"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <CarCleaning />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/maintenance-payments"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <MaintenancePayments />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/payment-history"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

