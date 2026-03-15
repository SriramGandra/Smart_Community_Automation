import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { userService } from '../services/dataService'
import { showToast } from '../utils/toast'
import '../styles/Dashboard.css'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    try {
      const fetchedUsers = await userService.getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      showToast('Failed to load users list', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, name) => {
    if (window.confirm(`Are you sure you want to delete the user ${name}?`)) {
      try {
        await userService.deleteUser(userId)
        setUsers(prev => prev.filter(u => u._id !== userId))
        showToast(`User ${name} deleted successfully`, 'success')
      } catch (error) {
        console.error('Error deleting user:', error)
        showToast('Failed to delete user', 'error')
      }
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (loading) {
    return (
      <Layout title="Manage Users">
        <div className="loading-container">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout title="Manage Users">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>All Registered Users</h2>
          <div style={{ padding: '0.4rem 0.8rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
            Total: {users.length}
          </div>
        </div>
        
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧑‍💻</div>
            <h3>No users found</h3>
            <p>There are currently no active users in the system.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Joined On</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: user.role === 'Admin' ? '#eef2ff' : user.role === 'Security' ? '#fffbeb' : '#f0fdf4',
                        color: user.role === 'Admin' ? '#4f46e5' : user.role === 'Security' ? '#d97706' : '#16a34a'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(user._id, user.name)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        disabled={user.role === 'Admin'}
                      >
                        Delete
                      </button>
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
