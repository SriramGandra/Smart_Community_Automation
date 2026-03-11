// Script to update resident users in MongoDB
// Run with: node scripts/updateResidents.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const residents = [
  {
    email: 'sriram@gmail.com',
    password: 'Sriram',
    role: 'Resident',
    name: 'Sriram'
  },
  {
    email: 'shiva@gmail.com',
    password: 'Shiva',
    role: 'Resident',
    name: 'Shiva'
  },
  {
    email: 'shrihan@gmail.com',
    password: 'Shrihan',
    role: 'Resident',
    name: 'Shrihan'
  },
  {
    email: 'meghanath@gmail.com',
    password: 'Meghanath',
    role: 'Resident',
    name: 'Meghanath'
  },
  {
    email: 'manideep@gmail.com',
    password: 'Manideep',
    role: 'Resident',
    name: 'Manideep'
  }
]

const updateResidents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-community', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    for (const resident of residents) {
      const existingUser = await User.findOne({ email: resident.email })
      
      if (existingUser) {
        // Update existing user - password will be hashed by pre-save hook
        existingUser.name = resident.name
        existingUser.password = resident.password // Setting this will trigger hashing on save
        await existingUser.save()
        console.log(`✅ Updated resident: ${resident.email} (${resident.name})`)
      } else {
        // Create new user
        await User.create(resident)
        console.log(`✅ Created resident: ${resident.email} (${resident.name})`)
      }
    }

    console.log('\n✅ All residents updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating residents:', error)
    process.exit(1)
  }
}

updateResidents()

