import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { complaintService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function Complaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    category: 'Maintenance',
    description: '',
    image: null
  })

  useEffect(() => {
    loadComplaints()
  }, [])

  const [loading, setLoading] = useState(true)

  const loadComplaints = async () => {
    setLoading(true)
    try {
      const all = await complaintService.getAll()
      if (user.role === 'Resident') {
        setComplaints(all.filter(c => c.userId === user.id))
      } else {
        setComplaints(all)
      }
    } catch (error) {
      console.error('Error loading complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await complaintService.create({
        ...formData,
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      })
      showToast('Complaint raised successfully', 'success')
      setShowModal(false)
      setFormData({ category: 'Maintenance', description: '', image: null })
      loadComplaints()
    } catch (error) {
      showToast('Failed to raise complaint', 'error')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintService.updateStatus(id, status)
      showToast('Status updated', 'success')
      loadComplaints()
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge-warning',
      'In Progress': 'badge-info',
      Resolved: 'badge-success'
    }
    return <span className={`badge ${badges[status] || 'badge-warning'}`}>{status}</span>
  }

  const categories = ['Maintenance', 'Security', 'Cleaning', 'Other']

  return (
    <Layout title="Complaints">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>{user.role === 'Admin' ? 'All Complaints' : 'My Complaints'}</h3>
        
        {user.role === 'Resident' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Raise Complaint
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No complaints</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {complaints.map(complaint => (
            <div key={complaint._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-info">{complaint.category}</span>
                    {getStatusBadge(complaint.status)}
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {user.role === 'Admin' && (
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      By: {complaint.userName} ({complaint.userEmail})
                    </div>
                  )}
                  <p style={{ color: 'var(--text)', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {complaint.description}
                  </p>
                  {complaint.image && (
                    <img 
                      src={complaint.image} 
                      alt="Complaint" 
                      style={{ maxWidth: '300px', borderRadius: '8px', marginTop: '1rem' }}
                    />
                  )}
                </div>
                
                {user.role === 'Admin' && complaint.status !== 'Resolved' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {complaint.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                        className="btn btn-primary"
                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                      >
                        Start Progress
                      </button>
                    )}
                    {complaint.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint._id, 'Resolved')}
                        className="btn btn-success"
                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Raise Complaint</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input"
                />
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', marginTop: '1rem', borderRadius: '8px' }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

