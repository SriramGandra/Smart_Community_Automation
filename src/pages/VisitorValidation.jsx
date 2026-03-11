import { useState } from 'react'
import Layout from '../components/Layout'
import { visitorService } from '../services/dataService'
import { isOTPExpired } from '../utils/otp'
import { showToast } from '../utils/toast'
import '../styles/Common.css'

export default function VisitorValidation() {
  const [otp, setOtp] = useState('')
  const [visitor, setVisitor] = useState(null)

  const [loading, setLoading] = useState(false)

  const handleOTPCheck = async () => {
    if (!otp || otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', 'error')
      return
    }

    setLoading(true)
    try {
      const foundVisitor = await visitorService.findByOTP(otp)
      
      if (!foundVisitor) {
        showToast('OTP not found or already used', 'error')
        setVisitor(null)
        return
      }

      if (isOTPExpired(foundVisitor.expiryTime)) {
        showToast('OTP has expired', 'error')
        setVisitor(null)
        return
      }

      setVisitor(foundVisitor)
      showToast('OTP validated successfully', 'success')
    } catch (error) {
      showToast('Failed to validate OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action) => {
    if (!visitor) return

    setLoading(true)
    try {
      // Handle both MongoDB _id and localStorage id
      const visitorId = visitor._id || visitor.id
      if (!visitorId) {
        showToast('Invalid visitor ID', 'error')
        return
      }
      
      await visitorService.update(visitorId, { status: action })
      showToast(`Visitor ${action.toLowerCase()}`, 'success')
      setVisitor(null)
      setOtp('')
    } catch (error) {
      showToast('Failed to update visitor status', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Visitor Validation">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Validate Visitor OTP</h3>
          
          <div className="form-group">
            <label className="form-label">Enter OTP</label>
            <input
              type="text"
              className="form-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem', fontFamily: 'monospace' }}
            />
          </div>

          <button onClick={handleOTPCheck} className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Validating...' : 'Validate OTP'}
          </button>
        </div>

        {visitor && (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Visitor Details</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Name:</strong> {visitor.visitorName}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Phone:</strong> {visitor.phoneNumber}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date & Time:</strong> {new Date(visitor.date).toLocaleDateString()} {visitor.time}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Resident:</strong> {visitor.residentName}
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Status:</strong> <span className="badge badge-warning">Pending</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => handleAction('Allowed')} 
                className="btn btn-success"
                style={{ flex: 1 }}
                disabled={loading}
              >
                Allow Entry
              </button>
              <button 
                onClick={() => handleAction('Denied')} 
                className="btn btn-danger"
                style={{ flex: 1 }}
                disabled={loading}
              >
                Deny Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

