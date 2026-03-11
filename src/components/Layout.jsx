import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Layout.css'

export default function Layout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNavLinks = () => {
    if (!user) return []
    
    if (user.role === 'Resident') {
      return [
        { path: '/resident-dashboard', label: 'Dashboard' },
        { path: '/visitor-entry', label: 'Visitor Entry' },
        { path: '/visitor-list', label: 'Visitors' },
        { path: '/amenities-booking', label: 'Book Amenities' },
        { path: '/booking-history', label: 'Bookings' },
        { path: '/announcements', label: 'Announcements' },
        { path: '/school-updates', label: 'School Updates' },
        { path: '/complaints', label: 'Complaints' },
        { path: '/parking', label: 'Parking' },
        { path: '/car-cleaning', label: 'Car Cleaning' },
        { path: '/maintenance-payments', label: 'Payments' }
      ]
    } else if (user.role === 'Admin') {
      return [
        { path: '/admin-dashboard', label: 'Dashboard' },
        { path: '/announcements', label: 'Announcements' },
        { path: '/school-updates', label: 'School Updates' },
        { path: '/complaints', label: 'Complaints' }
      ]
    } else if (user.role === 'Security') {
      return [
        { path: '/security-dashboard', label: 'Dashboard' },
        { path: '/visitor-validation', label: 'Validate Visitor' }
      ]
    }
    return []
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to={`/${user?.role?.toLowerCase()}-dashboard`} className="logo">
            <h1>Smart Community</h1>
          </Link>
          <nav className="nav">
            {getNavLinks().map(link => (
              <Link key={link.path} to={link.path} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="user-section">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>
      <main className="main-content">
        {title && <h2 className="page-title">{title}</h2>}
        {children}
      </main>
    </div>
  )
}

