import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { bookingService, complaintService, announcementService, userService } from '../services/dataService'
import '../styles/Dashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 150,
    totalBookings: 0,
    pendingComplaints: 0,
    totalAnnouncements: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, bookings, complaints, announcements] = await Promise.all([
          userService.getAllUsers(),
          bookingService.getAll(),
          complaintService.getAll(),
          announcementService.getAll()
        ])

        setStats({
          totalUsers: users.length,
          totalBookings: bookings.length,
          pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
          totalAnnouncements: announcements.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      color: 'primary',
      icon: '👥'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      color: 'success',
      icon: '📅'
    },
    {
      title: 'Pending Complaints',
      value: stats.pendingComplaints,
      color: 'warning',
      icon: '⚠️'
    },
    {
      title: 'Announcements',
      value: stats.totalAnnouncements,
      color: 'info',
      icon: '📢'
    }
  ]

  return (
    <Layout title="Admin Dashboard">
      <div className="dashboard">
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{card.value}</div>
                <div className="stat-title">{card.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h3>Management</h3>
          <div className="actions-grid">
            <Link to="/announcements" className="action-card">
              <div className="action-icon">📢</div>
              <div className="action-title">Manage Announcements</div>
            </Link>
            <Link to="/school-updates" className="action-card">
              <div className="action-icon">🏫</div>
              <div className="action-title">School Updates</div>
            </Link>
            <Link to="/complaints" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-title">Manage Complaints</div>
            </Link>
            <Link to="/admin/approvals" className="action-card">
              <div className="action-icon">👥</div>
              <div className="action-title">User Approvals</div>
            </Link>
            <Link to="/admin/users" className="action-card">
              <div className="action-icon">🧑‍💻</div>
              <div className="action-title">Manage Users</div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

