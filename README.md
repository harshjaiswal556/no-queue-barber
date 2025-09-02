# NoQueueBarber

## Multi-Vendor Barber Shop Booking Platform

A full-stack platform for booking haircut appointments across multiple barber shops.  
Inspired by platforms like **Cult Play**, this system enables **barber shops** to manage services and availability while allowing **customers** to seamlessly search, book, and pay for appointments online.

---

## 🚀 Features

- 👨‍🔧 **Barbershops**

  - Register and create shop profiles
  - Manage services, pricing, and working hours
  - Set and update availability
  - Prevent overbooking & manage queues

- 👤 **Customers**

  - Register and login
  - Search shops by location, rating, or service
  - View real-time availability
  - Book, reschedule, or cancel appointments
  - Leave reviews & ratings

- 💳 **Optional Payments**

  - Razorpay integration for prepaid bookings

- 🔔 **Notifications**
  - Real-time booking confirmations and reminders
  - Email updates via EmailJS

---

## 🏗️ Application Architecture Overview

| Layer / Component     | Description                                           | Technologies (Example)               |
| --------------------- | ----------------------------------------------------- | ------------------------------------ |
| **Frontend (Client)** | Web interface for customers & barbers                 | React.js, Tailwind CSS, ChakraUI     |
| **Backend (Server)**  | Business logic, slot management, APIs                 | Node.js + Express                    |
| **Database**          | Stores users, shops, bookings, services, availability | MongoDB                              |
| **Authentication**    | Secure login/signup for users                         | JWT                                  |
| **API Layer**         | REST endpoints (or GraphQL)                           | Express REST API                     |
| **Payment Gateway**   | Prepaid bookings                                      | Stripe / Razorpay                    |
| **Cloud Hosting**     | Deployment for backend & frontend                     | AWS / GCP / Azure / Vercel / Netlify |

---

## 📊 Data Models

### Users

```
id | name | email | phone | password | role (barber/customer) | created_at
```

### Shops

```
id | barber_id | shop_name | address | zipcode | services (JSON) | working_hours (JSON) | image_url | created_at
```

### Availability

```
id | shop_id | day | total_chairs | time_slots (array/linked table)
```

### Bookings

```
id | shop_id | customer_id | date | time_slot (JSON) | status (booked/cancelled/completed) | payment_status | services | amount | created_at
```

For more details please visit this link:

```
https://docs.google.com/document/d/1jh9oK8CyxwwzflYg3q7omZKF7mD3v6IzP8p6KmWJkvU/edit?usp=sharing
```

---

## Setup Instructions

### Prerequisites

1. Node.js >= 18.x
2. MongoDB
3. Git

### Backend

Clone repository

```
git clone https://github.com/yourusername/barber-booking-platform.git
cd barber-booking-platform/server
```

Install dependencies

```
npm install
```

Setup environment variables

Create .env file

```
MONGO_URI = "MongoDB_Compass_URL"
PORT = 3000
JWT_SECRET = "my_secret_key"
CLIENT_URL = "http://localhost:5173"
```

<!-- Start server -->

npm run dev

### Frontend

```
cd ../frontend
```

Install dependencies

```
npm install
```

Setup environment variables
create .env file

```
VITE_SERVER_BASE_URL = 'http://localhost:3000/'
```

Start frontend

```
npm run dev
```

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a new branch (feature/my-feature)
3. Commit your changes (git commit -m "Add feature")
4. Push to branch (git push origin feature/my-feature)
5. Open a Pull Request
