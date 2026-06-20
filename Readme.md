# 🍽️ DineStream POS

Full-stack Restaurant Point of Sale (POS) system built with the MERN stack and PostgreSQL.

## 📁 Project Structure
dinestream-pos-system/

├── dinestream-backend/    # Node.js + Express + PostgreSQL API

└── dinestream-pos/         # React + Vite + Tailwind CSS frontend

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS v4
- React Router v6
- Recharts
- Axios
- Context API + useReducer

**Backend:**
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcryptjs

## ✨ Features

- 🔐 Role-based authentication (Admin, Manager, Waiter, Chef)
- 📊 Real-time dashboard with analytics
- 🍕 Menu management (CRUD)
- 🛒 Order management with status tracking
- 🪑 Visual table floor map
- 👥 Staff management
- 📈 Sales reports & charts

## 🚀 Getting Started

### Backend Setup
```bash
cd dinestream-backend
npm install
npx prisma db push
npx prisma generate
node prisma/seed.js
npm run dev
```

### Frontend Setup
```bash
cd dinestream-pos
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/dinestream"

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

**Frontend `.env`:**
VITE_API_BASE_URL=http://localhost:5000/api

## 🔑 Demo Credentials
Email:    admin@dinestream.com

Password: Admin@123

## 👨‍💻 Author

Built by Muhammad Sohail as a portfolio + university project.