import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { paymentService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function MaintenancePayments() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    period: 'Monthly',
    amount: 2000
  })

  const periods = {
    Monthly: { amount: 2000, months: 1 },
    Quarterly: { amount: 5500, months: 3 },
    Yearly: { amount: 20000, months: 12 }
  }

  const handlePeriodChange = (period) => {
    setFormData({
      period,
      amount: periods[period].amount
    })
  }

  const [loading, setLoading] = useState(false)

  const handlePayment = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    try {
      await paymentService.create({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        period: formData.period,
        amount: formData.amount,
        months: periods[formData.period].months
      })
      
      showToast('Payment successful!', 'success')
      navigate('/payment-history')
    } catch (error) {
      showToast('Payment failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = () => {
    // Mock invoice download
    showToast('Invoice download started', 'info')
  }

  return (
    <Layout title="Maintenance Payments">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Make Maintenance Payment</h3>
        
        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label className="form-label">Payment Period</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.keys(periods).map(period => (
                <label 
                  key={period}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem',
                    border: formData.period === period ? '2px solid var(--primary)' : '2px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="period"
                    value={period}
                    checked={formData.period === period}
                    onChange={() => handlePeriodChange(period)}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{period}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                      ₹{periods[period].amount} for {periods[period].months} month{periods[period].months > 1 ? 's' : ''}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            background: 'var(--bg)', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
              Total Amount
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
              ₹{formData.amount}
            </div>
          </div>

          <div style={{ 
            padding: '1rem', 
            background: '#fef3c7', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            color: '#92400e',
            fontSize: '0.9rem'
          }}>
            ⚠️ This is a mock payment. No actual transaction will be processed.
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
          
          <button 
            type="button" 
            onClick={downloadInvoice}
            className="btn btn-outline" 
            style={{ width: '100%' }}
          >
            Download Invoice
          </button>
        </form>
      </div>
    </Layout>
  )
}

