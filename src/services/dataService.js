// Centralized data service with API integration and localStorage fallback

import { apiClient } from './apiClient'

const STORAGE_KEYS = {
  VISITORS: 'smart_community_visitors',
  BOOKINGS: 'smart_community_bookings',
  ANNOUNCEMENTS: 'smart_community_announcements',
  SCHOOL_UPDATES: 'smart_community_school_updates',
  COMPLAINTS: 'smart_community_complaints',
  PAYMENTS: 'smart_community_payments',
  PARKING: 'smart_community_parking',
  CAR_CLEANING: 'smart_community_car_cleaning'
}

// Initialize with mock data if empty
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([
      {
        id: '1',
        title: 'Welcome to Smart Community Platform',
        category: 'Event',
        content: 'We are excited to launch our new community management platform.',
        date: new Date().toISOString(),
        author: 'Admin'
      }
    ]))
  }
}

initializeData()

// Generic storage helpers (fallback)
function getItem(key) {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : []
}

function setItem(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// Helper to handle API calls with fallback
async function apiCallWithFallback(apiCall, fallbackCall) {
  try {
    return await apiCall()
  } catch (error) {
    console.warn('API call failed, using fallback:', error.message)
    return fallbackCall()
  }
}

// Visitor Service
export const visitorService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/visitors')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.VISITORS)
    )
  },

  async create(visitor) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/visitors', visitor)
        return response.data || response
      },
      () => {
        const visitors = getItem(STORAGE_KEYS.VISITORS)
        const newVisitor = {
          id: Date.now().toString(),
          ...visitor,
          status: 'Pending',
          createdAt: new Date().toISOString()
        }
        visitors.push(newVisitor)
        setItem(STORAGE_KEYS.VISITORS, visitors)
        return newVisitor
      }
    )
  },

  async update(id, updates) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.patch(`/visitors/${id}`, updates)
        return response.data || response
      },
      () => {
        const visitors = getItem(STORAGE_KEYS.VISITORS)
        const index = visitors.findIndex(v => v.id === id)
        if (index !== -1) {
          visitors[index] = { ...visitors[index], ...updates }
          setItem(STORAGE_KEYS.VISITORS, visitors)
          return visitors[index]
        }
        return null
      }
    )
  },

  async findByOTP(otp) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get(`/visitors/otp/${otp}`)
        return response.data || response
      },
      () => {
        const visitors = getItem(STORAGE_KEYS.VISITORS)
        return visitors.find(v => v.otp === otp && v.status === 'Pending')
      }
    )
  }
}

// Booking Service
export const bookingService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/bookings')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.BOOKINGS)
    )
  },

  async create(booking) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/bookings', booking)
        return response.data || response
      },
      () => {
        const bookings = getItem(STORAGE_KEYS.BOOKINGS)
        const newBooking = {
          id: Date.now().toString(),
          ...booking,
          status: 'Confirmed',
          createdAt: new Date().toISOString()
        }
        bookings.push(newBooking)
        setItem(STORAGE_KEYS.BOOKINGS, bookings)
        return newBooking
      }
    )
  },

  async cancel(id) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.patch(`/bookings/${id}`, { status: 'Cancelled' })
        return response.data || response
      },
      () => {
        const bookings = getItem(STORAGE_KEYS.BOOKINGS)
        const index = bookings.findIndex(b => b.id === id)
        if (index !== -1) {
          bookings[index].status = 'Cancelled'
          setItem(STORAGE_KEYS.BOOKINGS, bookings)
          return bookings[index]
        }
        return null
      }
    )
  },

  async getByAmenity(amenity, date) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/bookings', { amenity, date })
        const bookings = response.data || response
        return bookings.filter(b => b.status === 'Confirmed')
      },
      () => {
        const bookings = getItem(STORAGE_KEYS.BOOKINGS)
        return bookings.filter(b => 
          b.amenity === amenity && 
          b.date === date && 
          b.status === 'Confirmed'
        )
      }
    )
  },

  async checkAvailability(amenity, date, timeSlot) {
    const bookings = await this.getByAmenity(amenity, date)
    const capacity = amenity === 'Gym' ? 10 : 1
    if (amenity === 'Gym') {
      return bookings.filter(b => b.timeSlot === timeSlot).length < capacity
    } else {
      return bookings.length === 0
    }
  }
}

// Announcement Service
export const announcementService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/announcements')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.ANNOUNCEMENTS)
    )
  },

  async create(announcement) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/announcements', announcement)
        return response.data || response
      },
      () => {
        const announcements = getItem(STORAGE_KEYS.ANNOUNCEMENTS)
        const newAnnouncement = {
          id: Date.now().toString(),
          ...announcement,
          date: new Date().toISOString()
        }
        announcements.unshift(newAnnouncement)
        setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements)
        return newAnnouncement
      }
    )
  },

  async delete(id) {
    return apiCallWithFallback(
      async () => {
        await apiClient.delete(`/announcements/${id}`)
        return true
      },
      () => {
        const announcements = getItem(STORAGE_KEYS.ANNOUNCEMENTS)
        const filtered = announcements.filter(a => a.id !== id)
        setItem(STORAGE_KEYS.ANNOUNCEMENTS, filtered)
        return true
      }
    )
  }
}

// School Updates Service
export const schoolUpdateService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/school-updates')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.SCHOOL_UPDATES)
    )
  },

  async create(update) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/school-updates', update)
        return response.data || response
      },
      () => {
        const updates = getItem(STORAGE_KEYS.SCHOOL_UPDATES)
        const newUpdate = {
          id: Date.now().toString(),
          ...update,
          date: new Date().toISOString()
        }
        updates.unshift(newUpdate)
        setItem(STORAGE_KEYS.SCHOOL_UPDATES, updates)
        return newUpdate
      }
    )
  },

  async delete(id) {
    return apiCallWithFallback(
      async () => {
        await apiClient.delete(`/school-updates/${id}`)
        return true
      },
      () => {
        const updates = getItem(STORAGE_KEYS.SCHOOL_UPDATES)
        const filtered = updates.filter(u => u.id !== id)
        setItem(STORAGE_KEYS.SCHOOL_UPDATES, filtered)
        return true
      }
    )
  }
}

// Complaint Service
export const complaintService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/complaints')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.COMPLAINTS)
    )
  },

  async create(complaint) {
    // Handle image upload
    if (complaint.image && typeof complaint.image === 'string' && complaint.image.startsWith('data:')) {
      // Convert base64 to blob for upload
      try {
        const formData = new FormData()
        formData.append('category', complaint.category)
        formData.append('description', complaint.description)
        formData.append('userName', complaint.userName || '')
        formData.append('userEmail', complaint.userEmail || '')
        
        // Convert base64 to blob
        const base64Response = await fetch(complaint.image)
        const blob = await base64Response.blob()
        formData.append('image', blob, 'complaint.jpg')
        
        return apiCallWithFallback(
          async () => {
            const response = await apiClient.postFormData('/complaints', formData)
            return response.data || response
          },
          () => {
            const complaints = getItem(STORAGE_KEYS.COMPLAINTS)
            const newComplaint = {
              id: Date.now().toString(),
              ...complaint,
              status: 'Pending',
              createdAt: new Date().toISOString()
            }
            complaints.unshift(newComplaint)
            setItem(STORAGE_KEYS.COMPLAINTS, complaints)
            return newComplaint
          }
        )
      } catch (error) {
        // Fallback if blob conversion fails
        return apiCallWithFallback(
          async () => {
            const response = await apiClient.post('/complaints', complaint)
            return response.data || response
          },
          () => {
            const complaints = getItem(STORAGE_KEYS.COMPLAINTS)
            const newComplaint = {
              id: Date.now().toString(),
              ...complaint,
              status: 'Pending',
              createdAt: new Date().toISOString()
            }
            complaints.unshift(newComplaint)
            setItem(STORAGE_KEYS.COMPLAINTS, complaints)
            return newComplaint
          }
        )
      }
    } else {
      return apiCallWithFallback(
        async () => {
          const response = await apiClient.post('/complaints', complaint)
          return response.data || response
        },
        () => {
          const complaints = getItem(STORAGE_KEYS.COMPLAINTS)
          const newComplaint = {
            id: Date.now().toString(),
            ...complaint,
            status: 'Pending',
            createdAt: new Date().toISOString()
          }
          complaints.unshift(newComplaint)
          setItem(STORAGE_KEYS.COMPLAINTS, complaints)
          return newComplaint
        }
      )
    }
  },

  async updateStatus(id, status) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.patch(`/complaints/${id}/status`, { status })
        return response.data || response
      },
      () => {
        const complaints = getItem(STORAGE_KEYS.COMPLAINTS)
        const index = complaints.findIndex(c => c.id === id)
        if (index !== -1) {
          complaints[index].status = status
          setItem(STORAGE_KEYS.COMPLAINTS, complaints)
          return complaints[index]
        }
        return null
      }
    )
  }
}

// Payment Service
export const paymentService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/payments')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.PAYMENTS)
    )
  },

  async create(payment) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/payments', payment)
        return response.data || response
      },
      () => {
        const payments = getItem(STORAGE_KEYS.PAYMENTS)
        const newPayment = {
          id: Date.now().toString(),
          ...payment,
          status: 'Completed',
          transactionId: `TXN${Date.now()}`,
          date: new Date().toISOString()
        }
        payments.unshift(newPayment)
        setItem(STORAGE_KEYS.PAYMENTS, payments)
        return newPayment
      }
    )
  }
}

// Parking Service
export const parkingService = {
  async getAssignedSlot() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/parking')
        return response.data || response
      },
      () => {
        const data = localStorage.getItem(STORAGE_KEYS.PARKING)
        return data ? JSON.parse(data) : { assignedSlot: 'A-101', guestBookings: [] }
      }
    )
  },

  async update(data) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.put('/parking', data)
        return response.data || response
      },
      () => {
        localStorage.setItem(STORAGE_KEYS.PARKING, JSON.stringify(data))
        return data
      }
    )
  },

  async bookGuestSlot(booking) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/parking/guest', booking)
        return response.data || response
      },
      async () => {
        const data = await this.getAssignedSlot()
        data.guestBookings = data.guestBookings || []
        data.guestBookings.push({
          id: Date.now().toString(),
          ...booking,
          date: new Date().toISOString()
        })
        await this.update(data)
        return data.guestBookings[data.guestBookings.length - 1]
      }
    )
  }
}

// Car Cleaning Service
export const carCleaningService = {
  async getAll() {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get('/car-cleaning')
        return response.data || response
      },
      () => getItem(STORAGE_KEYS.CAR_CLEANING)
    )
  },

  async create(booking) {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post('/car-cleaning', booking)
        return response.data || response
      },
      () => {
        const bookings = getItem(STORAGE_KEYS.CAR_CLEANING)
        const newBooking = {
          id: Date.now().toString(),
          ...booking,
          status: 'Scheduled',
          createdAt: new Date().toISOString()
        }
        bookings.push(newBooking)
        setItem(STORAGE_KEYS.CAR_CLEANING, bookings)
        return newBooking
      }
    )
  }
}

// User Service (Authentication and Management)
export const userService = {
  async signup(userData) {
    return apiClient.post('/auth/signup', userData)
  },

  async getPendingApprovals() {
    const response = await apiClient.get('/users/pending')
    return response.data || response
  },

  async updateStatus(userId, status) {
    const response = await apiClient.patch(`/users/${userId}/status`, { status })
    return response.data || response
  }
}
