# Server Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Backend Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Frontend Setup

1. In the root directory, create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Running Both Servers

### Option 1: Two Terminal Windows
- Terminal 1: `cd server && npm start`
- Terminal 2: `npm run dev`

### Option 2: Using npm-run-all (if installed)
Add to root `package.json`:
```json
{
  "scripts": {
    "dev:all": "npm-run-all --parallel dev dev:server",
    "dev:server": "cd server && npm start"
  }
}
```

Then run: `npm run dev:all`

## API Endpoints

The backend provides the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

- `GET /api/visitors` - Get all visitors
- `POST /api/visitors` - Create visitor
- `PATCH /api/visitors/:id` - Update visitor
- `GET /api/visitors/otp/:otp` - Find visitor by OTP

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking

- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement
- `DELETE /api/announcements/:id` - Delete announcement

- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint (with image upload)
- `PATCH /api/complaints/:id/status` - Update complaint status

- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment

- `GET /api/parking` - Get parking data
- `PUT /api/parking` - Update parking data
- `POST /api/parking/guest` - Book guest parking

- `GET /api/car-cleaning` - Get car cleaning bookings
- `POST /api/car-cleaning` - Create car cleaning booking

- `GET /api/school-updates` - Get school updates
- `POST /api/school-updates` - Create school update
- `DELETE /api/school-updates/:id` - Delete school update

- `GET /api/health` - Health check

## Fallback Behavior

The frontend is designed to work with or without a backend:
- If the server is available, it uses API calls
- If the server is unavailable, it falls back to localStorage
- This ensures the app works in both scenarios

## Production Deployment

1. Build the frontend:
```bash
npm run build
```

2. Set production environment variables:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

3. Deploy the `dist` folder to your hosting service

4. Deploy the backend server to your hosting service (Heroku, Railway, etc.)

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
- The backend server is running
- The CORS middleware is enabled in `server.js`
- The frontend URL is allowed in CORS settings

### Connection Errors
- Check that the backend server is running on port 5000
- Verify the `VITE_API_BASE_URL` in `.env` matches your server URL
- Check browser console for detailed error messages

### Authentication Issues
- Clear localStorage and try logging in again
- Check that JWT_SECRET is set in server `.env`
- Verify token is being sent in request headers

