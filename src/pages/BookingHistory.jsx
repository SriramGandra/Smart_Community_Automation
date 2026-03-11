import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { bookingService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function BookingHistory() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      try {
        const allBookings = await bookingService.getAll()
        const userBookings = allBookings.filter(b => b.userId === user.id)
        setBookings(userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } catch (error) {
        console.error('Error loading bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [user.id])

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancel(id)
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b))
        showToast('Booking cancelled', 'success')
      } catch (error) {
        showToast('Failed to cancel booking', 'error')
      }
    }
  }

  if (loading) {
    return (
      <Layout title="Booking History">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  if (bookings.length === 0) {
    return (
      <Layout title="Booking History">
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No bookings yet</h3>
          <p>Book an amenity to get started</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Booking History">
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>My Bookings</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(booking => (
            <div 
              key={booking.id} 
              style={{ 
                padding: '1.5rem', 
                border: '1px solid var(--border)', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {booking.amenity}
                </div>
                <div style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                  Date: {new Date(booking.date).toLocaleDateString()}
                </div>
                <div style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                  Time: {booking.timeSlot}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge ${booking.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
              
              {booking.status === 'Confirmed' && new Date(booking.date) >= new Date() && (
                <button 
                  onClick={() => handleCancel(booking.id)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

