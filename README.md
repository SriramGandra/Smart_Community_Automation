# Smart Community Amenities Management Platform

A complete frontend-only web application for managing community amenities, built with React and Vite.

## Features

### 🔐 Authentication
- Role-based login (Resident, Admin, Security)
- Session management using localStorage
- Protected routes based on user roles

### 👤 Resident Features
- **Dashboard**: Overview of bookings, complaints, payments, and announcements
- **Visitor Entry**: Generate OTP for visitors with expiry management
- **Amenities Booking**: Book Gym (time-slot based) or Party Hall (calendar-based)
- **Complaints**: Raise complaints with image upload
- **Parking**: View assigned slot and book guest parking
- **Car Cleaning**: Schedule car cleaning services with monthly plan option
- **Maintenance Payments**: Make payments (Monthly/Quarterly/Yearly)
- **Announcements**: View community announcements
- **School Updates**: View school notices and events

### 👨‍💼 Admin Features
- **Dashboard**: View statistics (users, bookings, complaints)
- **Announcements**: Create and manage announcements
- **School Updates**: Post school notices and events
- **Complaints**: Manage complaint status (Pending → In Progress → Resolved)

### 🛡️ Security Features
- **Visitor Validation**: Validate visitor OTP codes
- **Entry Management**: Allow or deny visitor entry

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **localStorage** - Data persistence
- **Vanilla CSS** - Styling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

#### Frontend Only (localStorage mode)
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:3000`

#### With Backend Server (MongoDB)
1. **Install MongoDB:**
   - Local: Install MongoDB Community Server
   - Cloud: Use MongoDB Atlas (free tier available)
   - See `DATABASE_SETUP.md` for detailed instructions

2. **Backend Setup:**
```bash
cd server
npm install
```

3. **Configure Database:**
   - Create `server/.env` file:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   MONGODB_URI=mongodb://localhost:27017/smart-community
   ```
   - For MongoDB Atlas, use your connection string

4. **Start Backend:**
```bash
cd server
npm start
```

5. **Frontend Setup:**
```bash
# In root directory
npm install
```

6. **Create `.env` file in root:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

7. **Start frontend:**
```bash
npm run dev
```

See `SETUP.md` and `DATABASE_SETUP.md` for detailed setup instructions.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable components
│   └── Layout.jsx    # Main layout with navigation
├── contexts/         # React contexts
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── Login.jsx
│   ├── ResidentDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── SecurityDashboard.jsx
│   ├── VisitorEntry.jsx
│   ├── VisitorList.jsx
│   ├── VisitorValidation.jsx
│   ├── AmenitiesBooking.jsx
│   ├── BookingHistory.jsx
│   ├── Announcements.jsx
│   ├── SchoolUpdates.jsx
│   ├── Complaints.jsx
│   ├── Parking.jsx
│   ├── CarCleaning.jsx
│   ├── MaintenancePayments.jsx
│   └── PaymentHistory.jsx
├── services/         # Data services
│   ├── authService.js
│   └── dataService.js
├── styles/           # CSS files
│   ├── index.css
│   ├── Layout.css
│   ├── Dashboard.css
│   ├── Login.css
│   └── Common.css
├── utils/            # Utility functions
│   ├── toast.js
│   └── otp.js
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Data Storage

### With Backend Server (MongoDB)
When connected to the backend server, all data is stored in MongoDB:
- **visitors** - Visitor entries with OTP
- **bookings** - Amenity bookings (Gym, Party Hall)
- **announcements** - Community announcements
- **schoolupdates** - School notices and events
- **complaints** - User complaints
- **payments** - Maintenance payments
- **parkings** - Parking assignments and guest bookings
- **carcleanings** - Car cleaning service bookings

### Without Backend (Fallback)
If the server is unavailable, data falls back to browser localStorage with the following keys:
- `smart_community_user` - Current user session
- `smart_community_visitors` - Visitor entries
- `smart_community_bookings` - Amenity bookings
- `smart_community_announcements` - Announcements
- `smart_community_school_updates` - School updates
- `smart_community_complaints` - Complaints
- `smart_community_payments` - Payment history
- `smart_community_parking` - Parking data
- `smart_community_car_cleaning` - Car cleaning bookings

## Usage

### Login
- Use any email and password
- Select your role (Resident/Admin/Security)
- Click "Sign In"

### As Resident
1. Add visitors and generate OTP
2. Book amenities (Gym or Party Hall)
3. Raise complaints with images
4. Make maintenance payments
5. View announcements and school updates

### As Admin
1. Create announcements
2. Post school updates
3. Manage complaints (update status)

### As Security
1. Validate visitor OTP codes
2. Allow or deny entry

## Features in Detail

### OTP System
- 6-digit OTP generation
- 2-hour expiry time
- One-time use validation

### Amenities Booking
- **Gym**: 15 time slots per day, 10 slots per time slot
- **Party Hall**: One booking per day
- Real-time availability checking
- Booking cancellation

### Complaint Management
- Image upload (stored as base64)
- Status workflow: Pending → In Progress → Resolved
- Category-based filtering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- **Frontend**: Works standalone with localStorage fallback
- **Backend**: Optional MongoDB integration for persistent storage
- **Data Persistence**: 
  - With server: MongoDB database
  - Without server: Browser localStorage (automatic fallback)
- Mock payment processing (no real transactions)
- Responsive design for mobile and desktop
- JWT authentication when using backend

## License

MIT

