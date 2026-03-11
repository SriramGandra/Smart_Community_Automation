import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { visitorService } from '../services/dataService'
import { isOTPExpired } from '../utils/otp'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function VisitorList() {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVisitors = async () => {
      setLoading(true)
      try {
        const allVisitors = await visitorService.getAll()
        const userVisitors = allVisitors.filter(v => v.residentEmail === user.email)
        setVisitors(userVisitors)
      } catch (error) {
        console.error('Error loading visitors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadVisitors()
  }, [user.email])

  if (loading) {
    return (
      <Layout title="Visitor List">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  const getStatusBadge = (visitor) => {
    if (visitor.status === 'Allowed') {
      return <span className="badge badge-success">Allowed</span>
    }
    if (visitor.status === 'Denied') {
      return <span className="badge badge-danger">Denied</span>
    }
    if (isOTPExpired(visitor.expiryTime)) {
      return <span className="badge badge-danger">Expired</span>
    }
    return <span className="badge badge-warning">Pending</span>
  }

  if (visitors.length === 0) {
    return (
      <Layout title="Visitor List">
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3>No visitors added yet</h3>
          <p>Add a visitor to get started</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Visitor List">
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>All Visitors</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date & Time</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>OTP</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(visitor => (
                <tr key={visitor.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{visitor.visitorName}</td>
                  <td style={{ padding: '1rem' }}>{visitor.phoneNumber}</td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(visitor.date).toLocaleDateString()} {visitor.time}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {visitor.otp}
                  </td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(visitor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

