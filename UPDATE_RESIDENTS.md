# Update Resident Users in MongoDB

## Option 1: Using the Update Script (Recommended)

Run the update script to automatically update all resident users:

```bash
cd server
npm run update-residents
```

This will:
- Update existing users with new names and passwords
- Create new users if they don't exist
- Hash passwords automatically

## Option 2: Delete and Recreate (Simple)

1. **Stop your server** (if running)

2. **Connect to MongoDB:**
   ```powershell
   # If you have mongosh in PATH
   mongosh
   
   # Or navigate to MongoDB bin folder
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   .\mongosh.exe
   ```

3. **Delete existing resident users:**
   ```javascript
   use smart-community
   db.users.deleteMany({ role: "Resident" })
   ```

4. **Restart your server:**
   ```bash
   cd server
   npm start
   ```

   The server will automatically create the new resident users.

## Option 3: Manual Update via MongoDB Shell

1. **Connect to MongoDB:**
   ```powershell
   mongosh
   ```

2. **Switch to database:**
   ```javascript
   use smart-community
   ```

3. **Update each user manually:**
   ```javascript
   // Update Sriram
   db.users.updateOne(
     { email: "sriram@gmail.com" },
     { $set: { name: "Sriram", password: "$2a$10$..." } }
   )
   ```

   Note: For password updates, you need to hash them first, so Option 1 or 2 is easier.

## Current Resident Users

After update, these users will be available:

1. **Sriram**
   - Email: `sriram@gmail.com`
   - Password: `Sriram`

2. **Shiva**
   - Email: `shiva@gmail.com`
   - Password: `Shiva`

3. **Shrihan**
   - Email: `shrihan@gmail.com`
   - Password: `Shrihan`

4. **Meghanath**
   - Email: `meghanath@gmail.com`
   - Password: `Meghanath`

5. **Manideep**
   - Email: `manideep@gmail.com`
   - Password: `Manideep`

## Verify Updates

After running the update script, verify the users:

```javascript
use smart-community
db.users.find({ role: "Resident" }).pretty()
```

You should see all 5 residents with updated names.

