import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { bookingService, complaintService, paymentService, announcementService } from '../services/dataService'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Dashboard.css'

export default function ResidentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    activeComplaints: 0,
    pendingPayments: 0,
    latestAnnouncements: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [bookings, complaints, payments, announcements] = await Promise.all([
          bookingService.getAll(),
          complaintService.getAll(),
          paymentService.getAll(),
          announcementService.getAll()
        ])

        const upcomingBookings = bookings.filter(b => {
          const bookingDate = new Date(b.date)
          return b.userId === user.id && bookingDate >= new Date() && b.status === 'Confirmed'
        }).length

        const activeComplaints = complaints.filter(c => 
          c.userId === user.id && (c.status === 'Pending' || c.status === 'In Progress')
        ).length

        const pendingPayments = 0 // Mock - can be calculated based on due dates

        setStats({
          upcomingBookings,
          activeComplaints,
          pendingPayments,
          latestAnnouncements: announcements.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [user.id])

  if (loading) {
    return (
      <Layout title="Resident Dashboard">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  const statCards = [
    {
      title: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      link: '/booking-history',
      color: 'primary',
      icon: '📅'
    },
    {
      title: 'Active Complaints',
      value: stats.activeComplaints,
      link: '/complaints',
      color: 'warning',
      icon: '⚠️'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      link: '/maintenance-payments',
      color: 'danger',
      icon: '💳'
    },
    {
      title: 'Latest Announcements',
      value: stats.latestAnnouncements,
      link: '/announcements',
      color: 'success',
      icon: '📢'
    }
  ]

  return (
    <Layout title="Resident Dashboard">
      <div className="dashboard">
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <Link key={index} to={card.link} className="stat-card">
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{card.value}</div>
                <div className="stat-title">{card.title}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/visitor-entry" className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-title">Add Visitor</div>
            </Link>
            <Link to="/amenities-booking" className="action-card">
              <div className="action-icon">🏋️</div>
              <div className="action-title">Book Amenity</div>
            </Link>
            <Link to="/complaints" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-title">Raise Complaint</div>
            </Link>
            <Link to="/maintenance-payments" className="action-card">
              <div className="action-icon">💵</div>
              <div className="action-title">Make Payment</div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

