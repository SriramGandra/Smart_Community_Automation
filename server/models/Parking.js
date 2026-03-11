import mongoose from 'mongoose'

const guestBookingSchema = new mongoose.Schema({
  vehicleNumber: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true,
  _id: true
})

const parkingSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  assignedSlot: { 
    type: String, 
    default: 'A-101' 
  },
  guestBookings: [guestBookingSchema]
}, {
  timestamps: true
})

export default mongoose.model('Parking', parkingSchema)

