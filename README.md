# Multi-Vendor E-commerce Admin

Production-oriented MERN admin panel for vendor, product, order, and analytics management.

## Stack

- **Backend:** Node.js, Express, MongoDB, JWT, Joi, Cloudinary, Helmet, rate limiting
- **Frontend:** React 18, Redux Toolkit, React Router, Axios, Tailwind CSS v3, Recharts

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, Cloudinary keys
npm install
npm run seed:admin
npm run dev
```

API: `http://localhost:5001/api/v1`

Default seed admin: `admin@example.com` / `Admin@12345`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI: `http://localhost:5173`

## Architecture

Backend follows **Controller → Service → Repository** under `backend/src/modules/`.

Roles: `admin` (full access), `vendor` (scoped to linked `vendorRef`).
# Vendor-Management-EBG-Assessment
