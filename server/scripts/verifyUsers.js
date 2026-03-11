// Script to verify and recreate admin/security users
// Run with: node scripts/verifyUsers.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const verifyUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-community', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB\n')

    // Check Admin user
    let adminUser = await User.findOne({ email: 'admin@gmail.com' })
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@gmail.com',
        password: 'admin',
        role: 'Admin',
        name: 'Admin User'
      })
      console.log('✅ Admin user created')
    } else {
      console.log('✅ Admin user exists:')
      console.log(`   Email: ${adminUser.email}`)
      console.log(`   Role: ${adminUser.role}`)
      console.log(`   Name: ${adminUser.name}`)
      
      // Test password
      const passwordTest = await adminUser.comparePassword('admin')
      console.log(`   Password test: ${passwordTest ? '✅ Valid' : '❌ Invalid'}`)
      
      // Update if needed
      if (adminUser.role !== 'Admin') {
        adminUser.role = 'Admin'
        adminUser.name = 'Admin User'
        adminUser.password = 'admin' // Will be re-hashed
        await adminUser.save()
        console.log('   ✅ Updated admin user')
      }
    }

    console.log('')

    // Check Security user
    let securityUser = await User.findOne({ email: 'security@gmail.com' })
    if (!securityUser) {
      securityUser = await User.create({
        email: 'security@gmail.com',
        password: 'security',
        role: 'Security',
        name: 'Security Guard'
      })
      console.log('✅ Security user created')
    } else {
      console.log('✅ Security user exists:')
      console.log(`   Email: ${securityUser.email}`)
      console.log(`   Role: ${securityUser.role}`)
      console.log(`   Name: ${securityUser.name}`)
      
      // Test password
      const passwordTest = await securityUser.comparePassword('security')
      console.log(`   Password test: ${passwordTest ? '✅ Valid' : '❌ Invalid'}`)
      
      // Update if needed
      if (securityUser.role !== 'Security') {
        securityUser.role = 'Security'
        securityUser.name = 'Security Guard'
        securityUser.password = 'security' // Will be re-hashed
        await securityUser.save()
        console.log('   ✅ Updated security user')
      }
    }

    console.log('\n✅ Verification complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

verifyUsers()

