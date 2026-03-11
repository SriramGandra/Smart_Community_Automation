import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: ['Maintenance', 'Security', 'Cleaning', 'Other']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  image: { 
    type: String 
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
    default: 'Pending', 
    enum: ['Pending', 'In Progress', 'Resolved'],
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
})

export default mongoose.model('Complaint', complaintSchema)

