import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { schoolUpdateService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function SchoolUpdates() {
  const { user } = useAuth()
  const [updates, setUpdates] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Notice',
    class: '',
    content: '',
    eventDate: ''
  })

  useEffect(() => {
    loadUpdates()
  }, [])

  const [loading, setLoading] = useState(true)

  const loadUpdates = async () => {
    setLoading(true)
    try {
      const all = await schoolUpdateService.getAll()
      setUpdates(all)
    } catch (error) {
      console.error('Error loading updates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await schoolUpdateService.create({
        ...formData,
        author: user.name
      })
      showToast('School update posted successfully', 'success')
      setShowModal(false)
      setFormData({ title: '', type: 'Notice', class: '', content: '', eventDate: '' })
      loadUpdates()
    } catch (error) {
      showToast('Failed to post update', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      try {
        await schoolUpdateService.delete(id)
        showToast('Update deleted', 'success')
        loadUpdates()
      } catch (error) {
        showToast('Failed to delete update', 'error')
      }
    }
  }

  return (
    <Layout title="School Updates">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>School Notices & Events</h3>
        
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Post Update
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : updates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏫</div>
          <h3>No school updates</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {updates.map(update => (
            <div key={update.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{update.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge ${
                      update.type === 'Event' ? 'badge-info' : 'badge-success'
                    }`}>
                      {update.type}
                    </span>
                    {update.class && (
                      <span className="badge badge-warning">Class: {update.class}</span>
                    )}
                    {update.eventDate && (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        Event Date: {new Date(update.eventDate).toLocaleDateString()}
                      </span>
                    )}
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {user?.role === 'Admin' && (
                  <button
                    onClick={() => handleDelete(update.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text)', lineHeight: '1.6' }}>{update.content}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Post School Update</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Notice">Notice</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Class (leave empty for general)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="e.g., Grade 5A"
                />
              </div>
              {formData.type === 'Event' && (
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  className="form-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Post
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

