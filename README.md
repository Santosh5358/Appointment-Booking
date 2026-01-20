# Doctor Clinic Website

A professional healthcare website for physiotherapy, acupuncture, and acupressure services with online appointment booking system.

## Features

✅ **Professional UI/UX** - Modern, responsive design using Bootstrap 5  
✅ **Doctor Profile** - Display doctor information, qualifications, and work samples  
✅ **Services Management** - Manage physiotherapy, acupuncture, and acupressure services  
✅ **Online Booking System** - Patients can book appointments with date/time selection 
✅ **Email Booking Notification** - Once Booking is completed user get confirmation mail
✅ **Contact System** - Contact form with admin messaging system  
✅ **Home Visit Services** - Support for home-based consultations  
✅ **Google Maps Integration** - Embedded location information  
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices  

## Tech Stack

### Frontend
- **Angular 16** - Frontend framework
- **Bootstrap 5** - CSS framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **ng-bootstrap** - Bootstrap components for Angular

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication (optional)
- **CORS** - Cross-origin resource sharing

## Project Structure

```
doctor-website/
├── backend/
│   ├── models/
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   ├── Contact.js
│   │   └── DoctorProfile.js
│   ├── controllers/
│   │   ├── serviceController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   └── doctorController.js
│   ├── routes/
│   │   ├── services.js
│   │   ├── bookings.js
│   │   ├── contact.js
│   │   └── doctor.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── navbar/
    │   │   │   ├── footer/
    │   │   │   └── service-card/
    │   │   ├── pages/
    │   │   │   ├── home-page/
    │   │   │   ├── services-page/
    │   │   │   ├── booking-page/
    │   │   │   ├── contact-page/
    │   │   │   └── doctor-profile/
    │   │   ├── services/
    │   │   │   ├── service.service.ts
    │   │   │   ├── booking.service.ts
    │   │   │   ├── contact.service.ts
    │   │   │   └── doctor.service.ts
    │   │   ├── models/
    │   │   │   └── index.ts
    │   │   ├── app.module.ts
    │   │   ├── app-routing.module.ts
    │   │   ├── app.component.*
    │   │   └── ...
    │   ├── assets/
    │   ├── index.html
    │   ├── styles.css
    │   └── main.ts
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js v14+
- npm v6+
- MongoDB (local or Atlas)
- Angular CLI

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd doctor-website/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
   Create a `.env` file with the following:
```env
MONGODB_URI=mongodb://localhost:27017/doctor-website
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development

DOCTOR_NAME=Dr. Your Name
DOCTOR_EMAIL=doctor@example.com
DOCTOR_PHONE=+91-XXXXXXXXXX
DOCTOR_ADDRESS=Your Address Here
```

4. **Start MongoDB:**
```bash
# If running locally
mongod
```

5. **Run the backend server:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd doctor-website/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

Frontend will be running at `http://localhost:4200`

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category
- `POST /api/services` - Create new service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/by-email/:email` - Get bookings by email
- `GET /api/bookings/available-slots?date=YYYY-MM-DD` - Get available slots
- `PUT /api/bookings/:id/status` - Update booking status (admin)
- `DELETE /api/bookings/:id` - Delete booking

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get all contact messages (admin)
- `GET /api/contact/:id` - Get contact message by ID (admin)
- `PUT /api/contact/:id/read` - Mark as read (admin)
- `DELETE /api/contact/:id` - Delete message (admin)

### Doctor Profile
- `GET /api/doctor` - Get doctor profile
- `PUT /api/doctor` - Update doctor profile (admin)
- `POST /api/doctor/work-samples` - Add work sample (admin)
- `DELETE /api/doctor/work-samples/:sampleId` - Remove work sample (admin)

## Database Models

### Service
```javascript
{
  name: String,
  description: String,
  price: Number,
  duration: Number (minutes),
  image: String (URL),
  category: String (Physiotherapy/Acupuncture/Acupressure),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  patientAddress: String,
  service: ObjectId (ref: Service),
  appointmentDate: Date,
  appointmentTime: String (HH:MM),
  notes: String,
  status: String (pending/confirmed/completed/cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  read: Boolean,
  createdAt: Date
}
```

### DoctorProfile
```javascript
{
  name: String,
  title: String,
  specializations: [String],
  bio: String,
  experience: Number,
  profileImage: String (URL),
  email: String,
  phone: String,
  address: String,
  googleMapLink: String (URL),
  workSamples: [{
    title: String,
    description: String,
    image: String,
    date: Date
  }],
  consultationFee: Number,
  operatingHours: {
    monday: { start: String, end: String },
    // ... other days
  }
}
```

## Usage

### Adding Services
1. Start the backend server
2. Send a POST request to `/api/services` with the following data:
```json
{
  "name": "Deep Tissue Massage",
  "description": "Therapeutic massage for muscle tension",
  "price": 500,
  "duration": 60,
  "category": "Physiotherapy",
  "image": "url-to-image"
}
```

### Updating Doctor Profile
1. Send a PUT request to `/api/doctor` with profile data:
```json
{
  "name": "Dr. John Smith",
  "title": "Dr.",
  "specializations": ["Physiotherapy", "Acupuncture"],
  "bio": "Experienced healthcare professional...",
  "experience": 15,
  "email": "doctor@example.com",
  "phone": "+91-9876543210",
  "address": "123 Medical Street, City",
  "googleMapLink": "https://share.google/...",
  "consultationFee": 500,
  "operatingHours": {
    "monday": { "start": "09:00", "end": "18:00" },
    // ... other days
  }
}
```

### Booking an Appointment
Patients can book through the frontend form, which sends a POST request to `/api/bookings`

## Customization

### Colors
Edit the CSS variables in `frontend/src/styles.css`:
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  /* ... other colors */
}
```

### Branding
- Update navbar brand text in `frontend/src/app/components/navbar/navbar.component.html`
- Replace placeholder images in `frontend/src/assets/`
- Update doctor information in the backend `.env` file

### Services
- Add new specialization categories by modifying the enum in `backend/models/Service.js`
- Add service cards on homepage in `frontend/src/app/pages/home-page/`

## Security Considerations

1. **Environment Variables** - Keep sensitive information in `.env` files
2. **CORS** - Currently allows all origins. Configure in production:
   ```javascript
   const corsOptions = {
     origin: 'https://yourdomain.com',
     credentials: true
   };
   app.use(cors(corsOptions));
   ```
3. **Input Validation** - Always validate user input on both frontend and backend
4. **Database** - Use MongoDB connection string securely
5. **Authentication** - Implement JWT for admin operations
6. **HTTPS** - Use HTTPS in production

## Deployment

### Backend (Heroku Example)
```bash
cd backend
heroku create your-app-name
heroku addons:create mongolab:sandbox
git push heroku main
```

### Frontend (Vercel Example)
```bash
cd frontend
vercel
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name

### CORS Errors
- Check backend CORS configuration
- Ensure backend URL matches frontend API calls
- Verify both servers are running

### Angular Compilation Error
- Delete `node_modules` and reinstall: `npm install`
- Clear Angular cache: `ng cache clean`
- Ensure Angular CLI is installed: `npm install -g @angular/cli`

## Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] SMS reminders
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Rating and review system
- [ ] Video consultations
- [ ] Prescription management
- [ ] Mobile app (React Native/Flutter)

## Support & Contact

For queries about the Google Map link or any other information, reach out to your doctor directly using the contact details in the doctor profile section.

## License

This project is created for professional healthcare services.

## Notes

- The booking system manages appointment slots automatically
- Services can be filtered by category on the services page
- Contact messages are stored and can be managed from the admin panel
- All times are in 24-hour format (HH:MM)
- Dates follow YYYY-MM-DD format

---

**Happy coding! 🚀**
