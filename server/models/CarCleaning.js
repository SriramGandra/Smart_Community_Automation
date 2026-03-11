import mongoose from 'mongoose'

const carCleaningSchema = new mongoose.Schema({
  service: { 
    type: String, 
    required: [true, 'Service is required'] 
  },
  scheduledDate: { 
    type: String, 
    required: [true, 'Scheduled date is required'] 
  },
  monthlyPlan: { 
    type: Boolean, 
    default: false 
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'] 
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
  status: { 
    type: String, 
    default: 'Scheduled',
    enum: ['Scheduled', 'Completed', 'Cancelled']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
})

export default mongoose.model('CarCleaning', carCleaningSchema)

