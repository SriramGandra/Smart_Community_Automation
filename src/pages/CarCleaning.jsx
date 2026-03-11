import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { carCleaningService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function CarCleaning() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    service: 'Basic Wash',
    scheduledDate: '',
    monthlyPlan: false
  })

  useEffect(() => {
    loadBookings()
  }, [])

  const [loading, setLoading] = useState(true)

  const loadBookings = async () => {
    setLoading(true)
    try {
      const all = await carCleaningService.getAll()
      setBookings(all.filter(b => b.userId === user.id))
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    { value: 'Basic Wash', price: 200 },
    { value: 'Premium Wash', price: 400 },
    { value: 'Full Service', price: 600 },
    { value: 'Detailing', price: 1000 }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.scheduledDate) {
      showToast('Please select a date', 'error')
      return
    }

    try {
      const selectedService = services.find(s => s.value === formData.service)
      await carCleaningService.create({
        ...formData,
        userId: user.id,
        userName: user.name,
        price: formData.monthlyPlan ? selectedService.price * 4 : selectedService.price
      })
      
      showToast('Car cleaning service booked successfully', 'success')
      setShowModal(false)
      setFormData({ service: 'Basic Wash', scheduledDate: '', monthlyPlan: false })
      loadBookings()
    } catch (error) {
      showToast('Failed to book service', 'error')
    }
  }

  return (
    <Layout title="Car Cleaning">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Car Cleaning Services</h3>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Book Service
        </button>
      </div>

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🚗</div>
          <h3>No bookings yet</h3>
          <p>Book a car cleaning service to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(booking => (
            <div 
              key={booking.id} 
              className="card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {booking.service}
                  </div>
                  <div style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                    Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()}
                  </div>
                  <div style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    Price: ₹{booking.price} {booking.monthlyPlan && '(Monthly Plan)'}
                  </div>
                  <span className={`badge ${booking.status === 'Scheduled' ? 'badge-info' : 'badge-success'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Book Car Cleaning</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  {services.map(service => (
                    <option key={service.value} value={service.value}>
                      {service.value} - ₹{service.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Scheduled Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.monthlyPlan}
                    onChange={(e) => setFormData({ ...formData, monthlyPlan: e.target.checked })}
                  />
                  <span>Monthly Plan (4 services)</span>
                </label>
              </div>
              {formData.monthlyPlan && (
                <div style={{ 
                  padding: '1rem', 
                  background: '#dbeafe', 
                  borderRadius: '8px', 
                  marginBottom: '1rem',
                  color: '#1e40af'
                }}>
                  Monthly Plan: ₹{services.find(s => s.value === formData.service).price * 4} (4 services)
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Book
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

