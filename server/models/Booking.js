import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  amenity: { 
    type: String, 
    required: [true, 'Amenity is required'], 
    enum: ['Gym', 'Party Hall'] 
  },
  date: { 
    type: String, 
    required: [true, 'Date is required'],
    index: true
  },
  timeSlot: { 
    type: String, 
    required: [true, 'Time slot is required'] 
  },
  userId: { 
    type: String, 
    required: [true, 'User ID is required'],
    index: true
  },
  userName: { 
    type: String, 
    required: [true, 'User name is required'] 
  },
  userEmail: { 
    type: String, 
    required: [true, 'User email is required'] 
  },
  status: { 
    type: String, 
    default: 'Confirmed', 
    enum: ['Confirmed', 'Cancelled'],
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
})

// Compound index for availability queries
bookingSchema.index({ amenity: 1, date: 1, timeSlot: 1, status: 1 })

export default mongoose.model('Booking', bookingSchema)

