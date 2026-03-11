import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import '../styles/Dashboard.css'

export default function SecurityDashboard() {
  return (
    <Layout title="Security Dashboard">
      <div className="dashboard">
        <div className="quick-actions">
          <h3>Security Operations</h3>
          <div className="actions-grid">
            <Link to="/visitor-validation" className="action-card">
              <div className="action-icon">🔐</div>
              <div className="action-title">Validate Visitor OTP</div>
              <div className="action-description">Enter and validate visitor OTP codes</div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

