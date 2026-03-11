import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { visitorService } from '../services/dataService'
import { createOTPWithExpiry } from '../utils/otp'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function VisitorEntry() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    visitorName: '',
    phoneNumber: '',
    date: '',
    time: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.visitorName || !formData.phoneNumber || !formData.date || !formData.time) {
      showToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const { otp, expiryTime } = createOTPWithExpiry()
      
      const visitor = await visitorService.create({
        visitorName: formData.visitorName,
        phoneNumber: formData.phoneNumber,
        date: formData.date,
        time: formData.time,
        otp,
        expiryTime,
        residentEmail: user.email,
        residentName: user.name
      })

      showToast(`OTP generated: ${visitor.otp || otp}`, 'success')
      navigate('/visitor-list')
    } catch (error) {
      showToast('Failed to create visitor entry', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Visitor Entry">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Add New Visitor</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Visitor Name</label>
            <input
              type="text"
              name="visitorName"
              className="form-input"
              value={formData.visitorName}
              onChange={handleChange}
              placeholder="Enter visitor name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="time"
              className="form-input"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Generating...' : 'Generate OTP'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

