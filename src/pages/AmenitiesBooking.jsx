import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { bookingService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function AmenitiesBooking() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [amenity, setAmenity] = useState('Gym')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  
  const gymTimeSlots = [
    '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
    '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
    '18:00-19:00', '19:00-20:00', '20:00-21:00'
  ]

  const [loading, setLoading] = useState(false)
  const [selectedDateBookings, setSelectedDateBookings] = useState([])

  useEffect(() => {
    const loadBookings = async () => {
      if (date) {
        try {
          const bookings = await bookingService.getByAmenity(amenity, date)
          setSelectedDateBookings(bookings)
        } catch (error) {
          console.error('Error loading bookings:', error)
        }
      } else {
        setSelectedDateBookings([])
      }
    }
    loadBookings()
  }, [amenity, date])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!date) {
      showToast('Please select a date', 'error')
      return
    }

    if (amenity === 'Gym' && !timeSlot) {
      showToast('Please select a time slot', 'error')
      return
    }

    setLoading(true)
    try {
      const isAvailable = await bookingService.checkAvailability(amenity, date, timeSlot)
      if (!isAvailable) {
        showToast('This slot is already booked. Please choose another.', 'error')
        return
      }

      const booking = await bookingService.create({
        amenity,
        date,
        timeSlot: amenity === 'Gym' ? timeSlot : 'Full Day',
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      })

      showToast('Booking confirmed successfully!', 'success')
      navigate('/booking-history')
    } catch (error) {
      showToast('Failed to create booking', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Book Amenity">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Book an Amenity</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Amenity</label>
            <select
              className="form-select"
              value={amenity}
              onChange={(e) => {
                setAmenity(e.target.value)
                setTimeSlot('')
              }}
            >
              <option value="Gym">Gym</option>
              <option value="Party Hall">Party Hall</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {amenity === 'Gym' && (
            <div className="form-group">
              <label className="form-label">Select Time Slot</label>
              <select
                className="form-select"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              >
                <option value="">Choose a time slot</option>
                {gymTimeSlots.map(slot => {
                  const bookedCount = selectedDateBookings.filter(b => b.timeSlot === slot).length
                  const isAvailable = bookedCount < 10
                  return (
                    <option key={slot} value={slot} disabled={!isAvailable}>
                      {slot} {isAvailable ? `(${10 - bookedCount} slots available)` : '(Full)'}
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {amenity === 'Party Hall' && date && selectedDateBookings.length > 0 && (
            <div style={{ 
              padding: '1rem', 
              background: '#fee2e2', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              color: '#991b1b'
            }}>
              Party Hall is already booked for this date
            </div>
          )}

          {amenity === 'Party Hall' && date && selectedDateBookings.length === 0 && (
            <div style={{ 
              padding: '1rem', 
              background: '#d1fae5', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              color: '#065f46'
            }}>
              Party Hall is available for this date
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

