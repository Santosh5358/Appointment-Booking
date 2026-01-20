# Quick Start Guide - Doctor Website

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Prerequisites
```bash
# Check if you have Node.js installed
node --version
npm --version

# If not installed, download from https://nodejs.org/
```

### Step 2: Backend Setup
```bash
# Navigate to backend folder
cd doctor-website/backend

# Install dependencies
npm install

# Update .env file with your information
# Open .env and fill in your details

# Seed the database with sample data
node seed.js

# Start the server
npm start
# Server will run on http://localhost:5000
```

### Step 3: Frontend Setup (in a new terminal)
```bash
# Navigate to frontend folder
cd doctor-website/frontend

# Install dependencies
npm install

# Start the development server
npm start
# Opens automatically at http://localhost:4200
```

## 📝 Configuration

### Update Doctor Information
Edit `.env` file in backend folder:
```env
DOCTOR_NAME=Your Name
DOCTOR_EMAIL=your_email@example.com
DOCTOR_PHONE=+91-1234567890
DOCTOR_ADDRESS=Your Address
```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Run MongoDB server
mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/doctor-website
```

**Option 2: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-website?retryWrites=true&w=majority
```

## 🎯 Features Overview

### Home Page
- Hero section with doctor introduction
- Featured services showcase
- Why choose us section
- Call-to-action buttons

### Services Page
- Browse all services
- Filter by category (Physiotherapy, Acupuncture, Acupressure)
- View service details and pricing

### Doctor Profile Page
- Doctor biography and photo
- Qualifications and experience
- Operating hours
- Contact information
- Work samples and portfolio

### Booking Page
- Select service and date
- Auto-load available time slots
- Fill patient details
- Confirmation message

### Contact Page
- Contact form
- Doctor contact details
- Google Maps integration
- Operating hours display

## 🔧 Common Tasks

### Add New Service
```bash
# Use API tool like Postman or curl:
POST http://localhost:5000/api/services

{
  "name": "Service Name",
  "description": "Service description",
  "price": 500,
  "duration": 60,
  "category": "Physiotherapy"
}
```

### View All Bookings
```bash
GET http://localhost:5000/api/bookings
```

### Check Available Slots
```bash
GET http://localhost:5000/api/bookings/available-slots?date=2024-02-15
```

## 📱 Responsive Design

The website works perfectly on:
- ✅ Desktop (1920px and above)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (320px and above)

## 🎨 Customization

### Change Colors
Edit `frontend/src/styles.css`:
```css
:root {
  --primary-color: #007bff;  /* Change this */
  --secondary-color: #6c757d;
}
```

### Change Fonts
Edit `frontend/src/index.html` to add Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
```

Then update `frontend/src/styles.css`:
```css
body {
  font-family: 'Poppins', sans-serif;
}
```

### Add Images
1. Place images in `frontend/src/assets/`
2. Reference in components:
```html
<img src="assets/image-name.jpg" alt="Description">
```

## 🔐 Security Checklist

Before going live:
- [ ] Change JWT_SECRET in .env
- [ ] Update CORS settings in backend/server.js
- [ ] Use HTTPS
- [ ] Set NODE_ENV=production
- [ ] Implement admin authentication
- [ ] Add payment gateway for fees
- [ ] Backup database regularly

## 🐛 Troubleshooting

### "Cannot find module 'mongoose'"
```bash
cd backend
npm install
```

### "Port 5000 already in use"
```bash
# Change PORT in .env or kill process using the port
```

### "MongoError: connect ECONNREFUSED"
- Start MongoDB server: `mongod`
- Or update MongoDB Atlas connection string

### Angular compilation error
```bash
cd frontend
rm -rf node_modules
npm install
ng cache clean
npm start
```

### CORS Error in Browser
- Check backend CORS configuration
- Verify frontend API URL matches backend URL
- Ensure both servers are running

## 📊 Database Management

### Backup MongoDB
```bash
mongodump --db doctor-website --out ./backup
```

### Restore MongoDB
```bash
mongorestore ./backup
```

### Reset Database
```bash
# In MongoDB shell:
use doctor-website
db.dropDatabase()

# Then run seed again:
cd backend
node seed.js
```

## 📞 Support

For issues related to:
- **Google Maps Link**: Check the link from Google Maps and update in doctor profile
- **Appointments**: Check database for booking records
- **Services**: Verify services are created in database

## 🚀 Deployment

### Deploy Backend (Heroku)
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel/Netlify)
```bash
cd frontend
# For Vercel
vercel

# For Netlify
netlify deploy --prod --dir=dist/doctor-website-frontend
```

## 📚 Useful Resources

- Angular Docs: https://angular.io/docs
- Bootstrap Docs: https://getbootstrap.com/docs
- Express.js Docs: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- Postman (for API testing): https://www.postman.com/

---

**You're all set! 🎉**

The website is now ready. Start promoting your healthcare services!
