import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { announcementService } from '../services/dataService'
import { showToast } from '../utils/toast'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Common.css'

export default function Announcements() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Event',
    content: ''
  })

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const [loading, setLoading] = useState(true)

  const loadAnnouncements = async () => {
    setLoading(true)
    try {
      const all = await announcementService.getAll()
      setAnnouncements(all)
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await announcementService.create({
        ...formData,
        author: user.name
      })
      showToast('Announcement created successfully', 'success')
      setShowModal(false)
      setFormData({ title: '', category: 'Event', content: '' })
      loadAnnouncements()
    } catch (error) {
      showToast('Failed to create announcement', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.delete(id)
        showToast('Announcement deleted', 'success')
        loadAnnouncements()
      } catch (error) {
        showToast('Failed to delete announcement', 'error')
      }
    }
  }

  const filtered = filter === 'All' 
    ? announcements 
    : announcements.filter(a => a.category === filter)

  const categories = ['All', 'Maintenance', 'Event', 'Emergency']

  return (
    <Layout title="Announcements">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {user?.role === 'Admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Create Announcement
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📢</div>
          <h3>No announcements</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map(announcement => (
            <div key={announcement.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{announcement.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge ${
                      announcement.category === 'Emergency' ? 'badge-danger' :
                      announcement.category === 'Maintenance' ? 'badge-warning' :
                      'badge-info'
                    }`}>
                      {announcement.category}
                    </span>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      by {announcement.author}
                    </span>
                  </div>
                </div>
                {user?.role === 'Admin' && (
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text)', lineHeight: '1.6' }}>{announcement.content}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Announcement</h3>
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
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Event">Event</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
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
                  Create
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

