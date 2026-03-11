import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'], 
    enum: ['Maintenance', 'Event', 'Emergency'],
    index: true
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'] 
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

export default mongoose.model('Announcement', announcementSchema)

