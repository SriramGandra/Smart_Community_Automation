import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
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
  period: { 
    type: String, 
    required: [true, 'Period is required'],
    enum: ['Monthly', 'Quarterly', 'Yearly']
  },
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'] 
  },
  months: { 
    type: Number, 
    required: [true, 'Months is required'] 
  },
  status: { 
    type: String, 
    default: 'Completed' 
  },
  transactionId: { 
    type: String, 
    required: [true, 'Transaction ID is required'],
    unique: true,
    index: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
})

export default mongoose.model('Payment', paymentSchema)

