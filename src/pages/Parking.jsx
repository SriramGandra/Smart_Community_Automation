import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { parkingService } from '../services/dataService'
import { showToast } from '../utils/toast'
import '../styles/Common.css'

export default function Parking() {
  const [parkingData, setParkingData] = useState(null)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestForm, setGuestForm] = useState({
    vehicleNumber: '',
    date: '',
    time: ''
  })

  useEffect(() => {
    loadParkingData()
  }, [])

  const [loading, setLoading] = useState(true)

  const loadParkingData = async () => {
    setLoading(true)
    try {
      const data = await parkingService.getAssignedSlot()
      setParkingData(data)
    } catch (error) {
      console.error('Error loading parking data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestBooking = async (e) => {
    e.preventDefault()
    if (!guestForm.vehicleNumber || !guestForm.date || !guestForm.time) {
      showToast('Please fill in all fields', 'error')
      return
    }

    try {
      await parkingService.bookGuestSlot(guestForm)
      showToast('Guest parking booked successfully', 'success')
      setShowGuestModal(false)
      setGuestForm({ vehicleNumber: '', date: '', time: '' })
      loadParkingData()
    } catch (error) {
      showToast('Failed to book guest parking', 'error')
    }
  }

  if (loading && !parkingData) {
    return (
      <Layout title="Parking">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout title="Parking">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Assigned Parking Slot</h3>
          <div style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {parkingData?.assignedSlot || 'A-101'}
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Your Reserved Parking Slot</div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Guest Parking</h3>
            <button onClick={() => setShowGuestModal(true)} className="btn btn-primary">
              + Book Guest Parking
            </button>
          </div>

          {parkingData?.guestBookings?.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <div className="empty-state-icon">🚙</div>
              <p>No guest parking bookings</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {parkingData?.guestBookings?.map(booking => (
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
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Vehicle: {booking.vehicleNumber}
                    </div>
                    <div style={{ color: 'var(--text-light)' }}>
                      Date: {new Date(booking.date).toLocaleDateString()} | Time: {booking.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showGuestModal && (
        <div className="modal-overlay" onClick={() => setShowGuestModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Book Guest Parking</h3>
              <button className="modal-close" onClick={() => setShowGuestModal(false)}>×</button>
            </div>
            <form onSubmit={handleGuestBooking}>
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={guestForm.vehicleNumber}
                  onChange={(e) => setGuestForm({ ...guestForm, vehicleNumber: e.target.value })}
                  placeholder="e.g., ABC-1234"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={guestForm.date}
                  onChange={(e) => setGuestForm({ ...guestForm, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={guestForm.time}
                  onChange={(e) => setGuestForm({ ...guestForm, time: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Book
                </button>
                <button type="button" onClick={() => setShowGuestModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
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

