# API Testing Guide

## Using Postman or Similar Tools

### 1. Services API

#### Get All Services
```
GET http://localhost:5000/api/services
```
Response:
```json
[
  {
    "_id": "...",
    "name": "Deep Tissue Massage",
    "description": "Therapeutic massage...",
    "price": 500,
    "duration": 60,
    "category": "Physiotherapy",
    "isActive": true
  }
]
```

#### Get Services by Category
```
GET http://localhost:5000/api/services/category/Physiotherapy
```

#### Create New Service (Admin)
```
POST http://localhost:5000/api/services
Content-Type: application/json

{
  "name": "Specialized Treatment",
  "description": "Description of treatment",
  "price": 800,
  "duration": 90,
  "category": "Acupuncture",
  "image": "https://example.com/image.jpg"
}
```

#### Update Service (Admin)
```
PUT http://localhost:5000/api/services/{serviceId}
Content-Type: application/json

{
  "price": 900,
  "description": "Updated description"
}
```

#### Delete Service (Admin)
```
DELETE http://localhost:5000/api/services/{serviceId}
```

---

### 2. Bookings API

#### Create Booking (Patient)
```
POST http://localhost:5000/api/bookings
Content-Type: application/json

{
  "patientName": "John Doe",
  "patientEmail": "john@example.com",
  "patientPhone": "9876543210",
  "patientAddress": "123 Main Street, City",
  "service": "serviceId_here",
  "appointmentDate": "2024-02-20",
  "appointmentTime": "14:00",
  "notes": "Any special requirements"
}
```

#### Get Available Slots for a Date
```
GET http://localhost:5000/api/bookings/available-slots?date=2024-02-20
```

#### Get Bookings by Email (Patient)
```
GET http://localhost:5000/api/bookings/by-email/patient@example.com
```

#### Get All Bookings (Admin)
```
GET http://localhost:5000/api/bookings
```

#### Get Single Booking
```
GET http://localhost:5000/api/bookings/{bookingId}
```

#### Update Booking Status (Admin)
```
PUT http://localhost:5000/api/bookings/{bookingId}/status
Content-Type: application/json

{
  "status": "confirmed"
}
```
Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

#### Delete Booking
```
DELETE http://localhost:5000/api/bookings/{bookingId}
```

---

### 3. Contact API

#### Send Contact Message (Public)
```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "Patient Name",
  "email": "patient@example.com",
  "phone": "9876543210",
  "subject": "Inquiry about services",
  "message": "I would like to know more about..."
}
```

#### Get All Contact Messages (Admin)
```
GET http://localhost:5000/api/contact
```

#### Get Single Contact Message (Admin)
```
GET http://localhost:5000/api/contact/{messageId}
```

#### Mark Message as Read (Admin)
```
PUT http://localhost:5000/api/contact/{messageId}/read
```

#### Delete Contact Message (Admin)
```
DELETE http://localhost:5000/api/contact/{messageId}
```

---

### 4. Doctor Profile API

#### Get Doctor Profile (Public)
```
GET http://localhost:5000/api/doctor
```

Response:
```json
{
  "_id": "...",
  "name": "Dr. Sharma",
  "title": "Dr.",
  "specializations": ["Physiotherapy", "Acupuncture"],
  "bio": "...",
  "experience": 15,
  "email": "doctor@example.com",
  "phone": "+91-9876543210",
  "address": "123 Medical Centre",
  "googleMapLink": "https://share.google/...",
  "workSamples": [...],
  "consultationFee": 500,
  "operatingHours": {...}
}
```

#### Update Doctor Profile (Admin)
```
PUT http://localhost:5000/api/doctor
Content-Type: application/json

{
  "name": "Dr. New Name",
  "bio": "Updated biography",
  "experience": 20,
  "consultationFee": 600,
  "operatingHours": {
    "monday": { "start": "09:00", "end": "18:00" },
    "tuesday": { "start": "09:00", "end": "18:00" }
  }
}
```

#### Add Work Sample (Admin)
```
POST http://localhost:5000/api/doctor/work-samples
Content-Type: application/json

{
  "title": "Treatment Success",
  "description": "Successfully treated a patient with...",
  "image": "https://example.com/image.jpg",
  "date": "2024-01-15"
}
```

#### Remove Work Sample (Admin)
```
DELETE http://localhost:5000/api/doctor/work-samples/{sampleId}
```

---

## Testing Workflow

### 1. Initialize Database
```bash
cd backend
npm run seed
```

### 2. Start Backend
```bash
npm start
# Server running on http://localhost:5000
```

### 3. Test Services
- Get all services: `GET /api/services`
- Filter by category: `GET /api/services/category/Physiotherapy`

### 4. Create a Booking
- Get available slots: `GET /api/bookings/available-slots?date=2024-02-20`
- Create booking: `POST /api/bookings`

### 5. Check Doctor Profile
- Get profile: `GET /api/doctor`
- Update profile: `PUT /api/doctor`

### 6. Test Contact Form
- Send message: `POST /api/contact`

---

## Sample Data (After Seeding)

### Services
1. Deep Tissue Massage - ₹500
2. Swedish Massage - ₹400
3. Sports Massage - ₹600
4. Acupuncture Treatment - ₹700
5. Facial Acupuncture - ₹800
6. Acupressure Therapy - ₹400
7. Foot Acupressure - ₹350
8. Physical Therapy Consultation - ₹300

### Operating Hours
- Monday to Friday: 09:00 - 18:00
- Saturday: 09:00 - 14:00
- Sunday: Closed

### Available Time Slots
Default slots: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00

---

## Error Handling

### Common Responses

**Success (200)**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Validation Error (400)**
```json
{
  "message": "Invalid input",
  "errors": [ ... ]
}
```

**Not Found (404)**
```json
{
  "message": "Resource not found"
}
```

**Server Error (500)**
```json
{
  "message": "Internal server error"
}
```

---

## Performance Tips

1. Use pagination for large datasets
2. Cache service list on frontend
3. Implement lazy loading for images
4. Optimize database queries
5. Use CDN for static assets

---

## Security Reminders

1. ✅ Validate all inputs on server
2. ✅ Use HTTPS in production
3. ✅ Implement rate limiting
4. ✅ Add authentication for admin endpoints
5. ✅ Use environment variables for secrets
6. ✅ Sanitize data in contact forms

---

## Postman Collection URL Format

```
{{baseUrl}}/api/services
{{baseUrl}}/api/bookings
{{baseUrl}}/api/contact
{{baseUrl}}/api/doctor
```

Set `baseUrl` as: `http://localhost:5000`

---

**Happy Testing! 🧪**
