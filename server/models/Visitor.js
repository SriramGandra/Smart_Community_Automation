import mongoose from 'mongoose'

const visitorSchema = new mongoose.Schema({
  visitorName: { 
    type: String, 
    required: [true, 'Visitor name is required'] 
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Phone number is required'] 
  },
  date: { 
    type: String, 
    required: [true, 'Date is required'] 
  },
  time: { 
    type: String, 
    required: [true, 'Time is required'] 
  },
  otp: { 
    type: String, 
    required: [true, 'OTP is required'],
    index: true
  },
  expiryTime: { 
    type: String, 
    required: [true, 'Expiry time is required'] 
  },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Allowed', 'Denied'],
    index: true
  },
  residentEmail: { 
    type: String, 
    required: [true, 'Resident email is required'],
    index: true
  },
  residentName: { 
    type: String, 
    required: [true, 'Resident name is required'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
})

export default mongoose.model('Visitor', visitorSchema)

