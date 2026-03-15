import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { showToast } from '../utils/toast'
import '../styles/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Resident')
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const success = await login(email, password, role)
      if (success) {
        showToast(`Welcome!`, 'success')
        // Get the actual role from the logged-in user
        const currentUser = JSON.parse(localStorage.getItem('user'))
        const userRole = currentUser?.role || role
        const dashboardPath = userRole === 'Admin' ? '/admin-dashboard' : 
                             userRole === 'Security' ? '/security-dashboard' : 
                             '/resident-dashboard'
        navigate(dashboardPath)
      } else {
        showToast('Invalid email or password', 'error')
      }
    } catch (error) {
      // Extract error message from API response
      const errorMessage = error.message || 'Login failed. Please check your credentials.'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Smart Community Platform</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Resident">Resident</option>
              <option value="Admin">Admin</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="login-note">
          New resident? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

