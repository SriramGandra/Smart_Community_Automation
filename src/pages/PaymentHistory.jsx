import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { paymentService } from '../services/dataService'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function PaymentHistory() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true)
      try {
        const all = await paymentService.getAll()
        setPayments(all.filter(p => p.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)))
      } catch (error) {
        console.error('Error loading payments:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPayments()
  }, [user.id])

  if (loading) {
    return (
      <Layout title="Payment History">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  const downloadInvoice = (payment) => {
    // Mock invoice download
    alert(`Downloading invoice for payment ${payment.transactionId}`)
  }

  if (payments.length === 0) {
    return (
      <Layout title="Payment History">
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <h3>No payment history</h3>
          <p>Make a payment to see it here</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Payment History">
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Payment History</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payments.map(payment => (
            <div 
              key={payment.id} 
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
                  ₹{payment.amount}
                </div>
                <div style={{ color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                  Period: {payment.period} ({payment.months} month{payment.months > 1 ? 's' : ''})
                </div>
                <div style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  Transaction ID: {payment.transactionId}
                </div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  {new Date(payment.date).toLocaleDateString()} {new Date(payment.date).toLocaleTimeString()}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <span className="badge badge-success">{payment.status}</span>
                <button 
                  onClick={() => downloadInvoice(payment)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

