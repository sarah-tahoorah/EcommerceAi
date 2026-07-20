# 👗 Glamora – AI-Powered Fashion E-Commerce Platform

Sellora is a modern AI-powered fashion e-commerce platform that helps users discover clothing, receive personalized outfit recommendations, and shop seamlessly. The application integrates Artificial Intelligence with an intuitive shopping experience to provide smart fashion suggestions and efficient product management.

---

# ✨ Features

## 👤 User Features

- User Registration & Login (JWT Authentication)
- Browse Fashion Products
- Search & Filter Products
- Product Details Page
- Add to Cart
- Wishlist Management
- Secure Checkout
- Order Placement
- Order History
- Responsive UI

---

## 🤖 AI Features

- AI Fashion Recommendation Engine
- Outfit Suggestions
- Image-Based Fashion Analysis
- Personalized Recommendations
- TensorFlow & OpenCV Integration
- FastAPI AI Microservice

---

## 🛍️ Admin Features

- Admin Dashboard
- Add Products
- Edit Products
- Delete Products
- Order Management
- Product Inventory Management

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer

## AI Service

- FastAPI
- TensorFlow
- OpenCV
- Python

---

# 📂 Project Structure

```
Ecommerce/
│
├── client/                 # React Frontend
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│
├── ai-service/             # AI Recommendation Service
│
├── public/
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/sarah-tahoorah/EcommerceAi

cd glamora
```

---

# Install Dependencies

## Frontend

```bash
cd client

npm install
```

## Backend

```bash
cd ../server

npm install
```

## AI Service

```bash
cd ../ai-service

pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/glamora

JWT_SECRET=your_secret_key

AI_SERVICE_URL=http://127.0.0.1:8000
```

---

# Start MongoDB

Make sure MongoDB is installed and running.

Default Local URI

```text
mongodb://127.0.0.1:27017/glamora
```

---

# Seed Database

Insert demo fashion products into MongoDB.

```bash
npm run seed
```

---

# Run Backend

```bash
cd server

npm run dev
```

Backend

```
http://localhost:5000
```

---

# Run Frontend

```bash
cd client

npm run dev
```

Frontend

```
http://localhost:5173
```

---

# Run AI Service

```bash
cd ai-service

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

AI Service

```
http://127.0.0.1:8000
```

---

# API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

---

## Products

```
GET /api/products

GET /api/products/:id

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id
```

---

## Orders

```
POST /api/orders

GET /api/orders
```

---

## AI

```
POST /api/ai/recommend

POST /api/ai/analyze
```

---

# Screens

- Login
- Register
- Home
- Product Listing
- Product Details
- Cart
- Wishlist
- Checkout
- Orders
- AI Recommendation
- Admin Dashboard

---

# Future Enhancements

- Payment Gateway Integration
- OTP Authentication
- Email Notifications
- Product Reviews
- Voice Shopping Assistant
- AI Virtual Try-On
- Dark Mode
- Multi-language Support
- Sales Analytics Dashboard

---

# Learning Outcomes

- Full Stack MERN Development
- REST API Development
- JWT Authentication
- MongoDB Database Design
- AI Integration using FastAPI
- TensorFlow Model Deployment
- React State Management
- Responsive UI Design

---

# Authors

Developed by

**Sarah Tahoorah**

Computer Science & Engineering (Artificial Intelligence)

---

# License

This project is developed for educational and learning purposes.