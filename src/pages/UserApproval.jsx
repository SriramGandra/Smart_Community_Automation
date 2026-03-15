import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { userService } from '../services/dataService'
import { showToast } from '../utils/toast'
import '../styles/Dashboard.css'

export default function UserApproval() {
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPendingUsers = async () => {
    try {
      const users = await userService.getPendingApprovals()
      setPendingUsers(users)
    } catch (error) {
      console.error('Error loading pending users:', error)
      showToast('Failed to load pending users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPendingUsers()
  }, [])

  const handleApproval = async (userId, status) => {
    try {
      await userService.updateStatus(userId, status)
      showToast(`User ${status.toLowerCase()} successfully`, 'success')
      setPendingUsers(prev => prev.filter(u => u._id !== userId))
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} user:`, error)
      showToast(`Failed to ${status.toLowerCase()} user`, 'error')
    }
  }

  if (loading) {
    return (
      <Layout title="User Approvals">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout title="User Approvals">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Pending Resident Approvals</h2>
        </div>
        
        {pendingUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No pending approvals</h3>
            <p>New signup requests will appear here</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Requested On</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>{user.name}</td>
                    <td style={{ padding: '1rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleApproval(user._id, 'Approved')}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleApproval(user._id, 'Rejected')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
