import mongoose from 'mongoose'

const schoolUpdateSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  type: { 
    type: String, 
    required: [true, 'Type is required'], 
    enum: ['Notice', 'Event'] 
  },
  class: { 
    type: String, 
    default: '' 
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'] 
  },
  eventDate: { 
    type: String 
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'] 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
})

export default mongoose.model('SchoolUpdate', schoolUpdateSchema)

