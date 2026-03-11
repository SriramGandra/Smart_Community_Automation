# Database Setup Guide

## MongoDB Installation

### Option 1: Local MongoDB Installation

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download and install MongoDB Community Server

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Installation:**
   ```bash
   mongosh
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create"

3. **Setup Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Project Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create or update `server/.env`:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/smart-community
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-community?retryWrites=true&w=majority
```

### 3. Start the Server

```bash
npm start
```

The server will automatically:
- Connect to MongoDB
- Create collections if they don't exist
- Initialize default data

## Database Models

The following collections are created automatically:

1. **visitors** - Visitor entries with OTP
2. **bookings** - Amenity bookings (Gym, Party Hall)
3. **announcements** - Community announcements
4. **schoolupdates** - School notices and events
5. **complaints** - User complaints
6. **payments** - Maintenance payments
7. **parkings** - Parking assignments and guest bookings
8. **carcleanings** - Car cleaning service bookings

## Database Operations

### Using MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass:**
   - Visit: https://www.mongodb.com/try/download/compass
   - Install and open

2. **Connect:**
   - For local: `mongodb://localhost:27017`
   - For Atlas: Use your connection string

3. **Browse Collections:**
   - Select `smart-community` database
   - View and edit documents

### Using MongoDB Shell (mongosh)

```bash
# Connect to database
mongosh
use smart-community

# View collections
show collections

# Query documents
db.visitors.find()
db.bookings.find()
db.announcements.find()

# Count documents
db.visitors.countDocuments()
```

## Data Migration (if needed)

If you have existing localStorage data, you can migrate it:

1. Export data from browser localStorage
2. Create a migration script to import into MongoDB
3. Run the script once

## Troubleshooting

### Connection Issues

**Error: "MongoNetworkError"**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check firewall settings

**Error: "Authentication failed"**
- Verify username and password in connection string
- Check database user permissions

**Error: "ECONNREFUSED"**
- MongoDB service might not be running
- Check if port 27017 is accessible

### Common Solutions

1. **Reset Database:**
   ```bash
   mongosh
   use smart-community
   db.dropDatabase()
   ```
   Then restart server to recreate collections

2. **Check MongoDB Logs:**
   - Windows: Check Event Viewer
   - Linux: `sudo tail -f /var/log/mongodb/mongod.log`
   - macOS: Check Console app

3. **Verify Connection:**
   ```bash
   mongosh "mongodb://localhost:27017/smart-community"
   ```

## Production Considerations

1. **Use Environment Variables:**
   - Never commit `.env` file
   - Use secure JWT_SECRET
   - Use MongoDB Atlas for production

2. **Backup Strategy:**
   - Regular database backups
   - Use MongoDB Atlas automated backups

3. **Security:**
   - Use strong passwords
   - Restrict network access
   - Enable authentication
   - Use SSL/TLS connections

4. **Performance:**
   - Add indexes for frequently queried fields
   - Monitor query performance
   - Use connection pooling

## Indexes

The following indexes are automatically created:
- `visitors.otp` - For OTP lookups
- `visitors.status` - For status filtering
- `visitors.residentEmail` - For user-specific queries
- `bookings.amenity`, `bookings.date`, `bookings.timeSlot` - For availability checks
- `complaints.userId` - For user-specific complaints
- `payments.userId` - For user payment history

## Next Steps

1. Install MongoDB (local or Atlas)
2. Update `.env` with connection string
3. Start server: `npm start`
4. Verify connection in console logs
5. Test API endpoints

Your application is now using MongoDB for persistent data storage! 🎉

