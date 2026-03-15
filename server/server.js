import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import User from './models/User.js'
import Visitor from './models/Visitor.js'
import Booking from './models/Booking.js'
import Announcement from './models/Announcement.js'
import SchoolUpdate from './models/SchoolUpdate.js'
import Complaint from './models/Complaint.js'
import Payment from './models/Payment.js'
import Parking from './models/Parking.js'
import CarCleaning from './models/CarCleaning.js'
import Waitlist from './models/Waitlist.js'


// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Connect to MongoDB
connectDB()

// Transform MongoDB document to include id field
const transformVisitor = (visitor) => {
  if (!visitor) return null
  const visitorObj = visitor.toObject ? visitor.toObject() : visitor
  return {
    ...visitorObj,
    id: visitorObj._id ? visitorObj._id.toString() : visitorObj.id
  }
}

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Initialize default data
const initializeDefaultData = async () => {
  try {
    // Create default users if they don't exist
    const adminUser = await User.findOne({ email: 'admin@gmail.com' })
    if (!adminUser) {
      await User.create({
        email: 'admin@gmail.com',
        password: 'Admin@sriram',
        role: 'Admin',
        name: 'Admin User'
      })
      console.log('✅ Admin user created (admin@gmail.com / admin)')
    } else {
      // Ensure admin user has correct role and password
      adminUser.role = 'Admin'
      adminUser.name = 'Admin User'
      adminUser.password = 'Admin@sriram'
      await adminUser.save()
      console.log('✅ Admin user role and password updated')
    }

    const securityUser = await User.findOne({ email: 'security@gmail.com' })
    if (!securityUser) {
      await User.create({
        email: 'security@gmail.com',
        password: 'Security123',
        role: 'Security',
        name: 'Security Guard'
      })
      console.log('✅ Security user created (security@gmail.com / security)')
    } else {
      // Ensure security user has correct role
      if (securityUser.role !== 'Security') {
        securityUser.role = 'Security'
        securityUser.name = 'Security Guard'
        await securityUser.save()
        console.log('✅ Security user role updated')
      }
    }

    // Create default resident users
    const residents = [
      {
        email: 'sriram@gmail.com',
        password: 'Sriram123',
        role: 'Resident',
        name: 'Sriram'
      },
      {
        email: 'shiva@gmail.com',
        password: 'Shiva123',
        role: 'Resident',
        name: 'Shiva'
      },
      {
        email: 'manideep@gmail.com',
        password: 'Manideep123',
        role: 'Resident',
        name: 'Manideep'
      },
      {
        email: 'admin@gmail.com',
        password: 'Admin@sriram',
        role: 'Admin',
        name: 'Admin'
      },
      {
        email: 'security@gmail.com',
        password: 'Security123',
        role: 'Security',
        name: 'Security'
      }
    ]

    for (const resident of residents) {
      const existingUser = await User.findOne({ email: resident.email })
      if (!existingUser) {
        await User.create({ ...resident, status: 'Approved' })
        console.log(`✅ Resident user created (${resident.email} / ${resident.password})`)
      } else {
        // Ensure existing default users are Approved
        if (existingUser.status !== 'Approved') {
          existingUser.status = 'Approved'
          await existingUser.save()
          console.log(`✅ Status updated to Approved for ${resident.email}`)
        }
        // Update existing user if name or password changed
        const needsUpdate = existingUser.name !== resident.name
        if (needsUpdate) {
          // Update name
          existingUser.name = resident.name
          await existingUser.save()
          console.log(`✅ Resident user updated (${resident.email})`)
        }
        // Note: Password update requires re-hashing, so we'll handle it separately
        // For now, if password needs to change, delete and recreate the user
      }
    }

    // Create default announcement
    const announcementCount = await Announcement.countDocuments()
    if (announcementCount === 0) {
      await Announcement.create({
        title: 'Welcome to Smart Community Platform',
        category: 'Event',
        content: 'We are excited to launch our new community management platform.',
        author: 'Admin'
      })
      console.log('✅ Default announcement created')
    }
  } catch (error) {
    console.error('Error initializing default data:', error)
  }
}

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  console.log('POST /api/auth/signup received:', req.body)
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    // Check if user already exists in main User table
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered as an active user' })
    }

    // Check if user is already on the waitlist
    const existingWaitlist = await Waitlist.findOne({ email: email.toLowerCase().trim() })
    if (existingWaitlist) {
      return res.status(400).json({ error: 'Email is already on the waitlist pending approval' })
    }

    const waitlistEntry = await Waitlist.create({
      email: email.toLowerCase().trim(),
      password, // Password will be hashed by pre-save hook in Waitlist model
      name,
      status: 'Pending'
    })

    console.log(`✅ New signup waitlist request: ${waitlistEntry.email}`)
    res.status(201).json({ message: 'Signup successful! Please wait for admin approval.' })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: error.message || 'An error occurred during signup' })
  }
})

// User Management Routes (Admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    // Fetch all users except passwords
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ data: users })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const userToDelete = await User.findById(req.params.id)
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (userToDelete.role === 'Admin' || userToDelete.role === 'Security') {
      return res.status(403).json({ error: 'Cannot delete Admin or Security accounts' })
    }

    await User.findByIdAndDelete(req.params.id)

    console.log(`✅ User ${userToDelete.email} deleted by admin`)
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/users/pending', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const pendingUsers = await Waitlist.find({ status: 'Pending' }).sort({ createdAt: -1 })
    res.json({ data: pendingUsers })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/users/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const { status } = req.body
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const waitlistEntry = await Waitlist.findById(req.params.id)

    if (!waitlistEntry) {
      return res.status(404).json({ error: 'Signup request not found' })
    }

    waitlistEntry.status = status
    await waitlistEntry.save()

    if (status === 'Approved') {
      // Create the actual user
      // Note: We need to bypass the User model pre-save hook hashing since the password in Waitlist is already hashed.
      // Easiest is to save it, then manually overwrite the password field if we wanted to avoid double hash.
      // But actually, the Waitlist model also uses bcrypt.
      // A cleaner way is to insert directly using the model but bypassing validation, or we update the User schema later.
      // We will create the user with the HASHED password from the Waitlist.
      const newUser = new User({
        name: waitlistEntry.name,
        email: waitlistEntry.email,
        password: waitlistEntry.password,
        role: 'Resident',
        status: 'Approved' // Keeping this temporarily so we don't break existing login code until we revert the User model
      })

      // Tell Mongoose not to hash it again by skipping the pre-save hook check if possible, or using updateOne
      await User.collection.insertOne({
        name: waitlistEntry.name,
        email: waitlistEntry.email,
        password: waitlistEntry.password,
        role: 'Resident',
        status: 'Approved',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Delete from waitlist once successfully migrated
      await Waitlist.findByIdAndDelete(req.params.id)
    }

    console.log(`✅ Waitlist entry ${waitlistEntry.email} processed as ${status}`)
    res.json({ data: waitlistEntry })
  } catch (error) {
    console.error('Status update error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`)
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log(`Login attempt failed: Invalid password for email ${email}`)
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Optional status check if status field is still on User document.
    // We will keep this for backward compatibility during the switch over to Waitlist
    if (user.status && user.status === 'Rejected') {
      return res.status(403).json({ error: 'Your account has been rejected' })
    }

    // Check if role matches (for Admin and Security, role must match exactly)
    if ((user.role === 'Admin' || user.role === 'Security') && user.role !== role) {
      console.log(`Login attempt failed: Role mismatch. User role: ${user.role}, Selected role: ${role}`)
      return res.status(403).json({ error: `Please select ${user.role} role to login` })
    }

    // For residents, allow any role selection (flexible)
    const userData = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }

    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    console.log(`✅ Successful login: ${user.email} as ${user.role}`)
    res.json({ token, user: userData })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message || 'An error occurred during login' })
  }
})

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, email: req.user.email, role: req.user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
  res.json({ token })
})

// Visitor Routes
app.get('/api/visitors', authenticateToken, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 })
    res.json({ data: visitors.map(transformVisitor) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/visitors', authenticateToken, async (req, res) => {
  try {
    const visitor = await Visitor.create({
      ...req.body,
      status: 'Pending'
    })
    res.json({ data: transformVisitor(visitor) })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.patch('/api/visitors/:id', authenticateToken, async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' })
    }
    res.json({ data: transformVisitor(visitor) })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/visitors/otp/:otp', authenticateToken, async (req, res) => {
  try {
    const visitor = await Visitor.findOne({
      otp: req.params.otp,
      status: 'Pending'
    })
    if (!visitor) {
      return res.status(404).json({ error: 'OTP not found or already used' })
    }
    res.json({ data: transformVisitor(visitor) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Booking Routes
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    let query = {}
    if (req.query.amenity && req.query.date) {
      query = {
        amenity: req.query.amenity,
        date: req.query.date,
        status: 'Confirmed'
      }
    }
    const bookings = await Booking.find(query).sort({ createdAt: -1 })
    res.json({ data: bookings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      status: 'Confirmed'
    })
    res.json({ data: booking })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.patch('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json({ data: booking })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Announcement Routes
app.get('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 })
    res.json({ data: announcements })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/announcements', authenticateToken, async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body)
    res.json({ data: announcement })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id)
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' })
    }
    res.json({ message: 'Announcement deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// School Updates Routes
app.get('/api/school-updates', authenticateToken, async (req, res) => {
  try {
    const updates = await SchoolUpdate.find().sort({ date: -1 })
    res.json({ data: updates })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/school-updates', authenticateToken, async (req, res) => {
  try {
    const update = await SchoolUpdate.create(req.body)
    res.json({ data: update })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/api/school-updates/:id', authenticateToken, async (req, res) => {
  try {
    const update = await SchoolUpdate.findByIdAndDelete(req.params.id)
    if (!update) {
      return res.status(404).json({ error: 'Update not found' })
    }
    res.json({ message: 'Update deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Complaint Routes
app.get('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 })
    res.json({ data: complaints })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/complaints', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const complaint = await Complaint.create({
      category: req.body.category,
      description: req.body.description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.id,
      userName: req.user.name || req.body.userName,
      userEmail: req.user.email || req.body.userEmail,
      status: 'Pending'
    })
    res.json({ data: complaint })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.patch('/api/complaints/:id/status', authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' })
    }
    res.json({ data: complaint })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Payment Routes
app.get('/api/payments', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 })
    res.json({ data: payments })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      status: 'Completed',
      transactionId: `TXN${Date.now()}`
    })
    res.json({ data: payment })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Parking Routes
app.get('/api/parking', authenticateToken, async (req, res) => {
  try {
    let parking = await Parking.findOne({ userId: req.user.id })
    if (!parking) {
      // Create default parking record
      parking = await Parking.create({
        userId: req.user.id,
        assignedSlot: 'A-101',
        guestBookings: []
      })
    }
    res.json({ data: parking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/parking', authenticateToken, async (req, res) => {
  try {
    let parking = await Parking.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    )
    res.json({ data: parking })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/parking/guest', authenticateToken, async (req, res) => {
  try {
    let parking = await Parking.findOne({ userId: req.user.id })
    if (!parking) {
      parking = await Parking.create({
        userId: req.user.id,
        assignedSlot: 'A-101',
        guestBookings: []
      })
    }

    parking.guestBookings.push(req.body)
    await parking.save()

    const newBooking = parking.guestBookings[parking.guestBookings.length - 1]
    res.json({ data: newBooking })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Car Cleaning Routes
app.get('/api/car-cleaning', authenticateToken, async (req, res) => {
  try {
    const bookings = await CarCleaning.find().sort({ createdAt: -1 })
    res.json({ data: bookings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/car-cleaning', authenticateToken, async (req, res) => {
  try {
    const booking = await CarCleaning.create({
      ...req.body,
      status: 'Scheduled'
    })
    res.json({ data: booking })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Initialize default data after connection
setTimeout(() => {
  initializeDefaultData()
}, 2000)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})
