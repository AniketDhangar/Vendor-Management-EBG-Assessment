# Multi-Vendor E-commerce Admin

Production-oriented MERN admin panel for vendor, product, order, and analytics management.
Live URL => https://vendorsmanagement-ebg.netlify.app

---

## 🚀 Live Deployment

* **Frontend (Netlify):** https://vendorsmanagement-ebg.netlify.app
* **Backend API (Render):** https://vendor-management-ebg-assessment.onrender.com/api/v1

---

## 🧰 Stack

* **Backend:** Node.js, Express, MongoDB, JWT, Joi, Cloudinary, Helmet, rate limiting
* **Frontend:** React 18, Redux Toolkit, React Router, Axios, Tailwind CSS v3, Recharts

---

## ⚡ Quick Start (Local Setup)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, Cloudinary keys
npm install
npm run dev
```

* Local API: http://localhost:5001/api/v1

---

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

* Local UI: http://localhost:5173

---

## 🔑 Demo Credentials

* **Admin Role**

  * Email: [21aniketdhangar13@gmail.com](mailto:21aniketdhangar13@gmail.com)
  * Password: 12345678

* **Vendor Role**

  * Email: [hemant@gmail.com](mailto:hemant@gmail.com)
  * Password: 12345678

---

## 🏗️ Architecture

```
Controller → Service → Repository
```

Location:

```
backend/src/modules/
```

---

## 🔐 Roles & Access Control

* **admin**

  * Full system access
  * Manage vendors, products, orders, analytics

* **vendor**

  * Scoped access via `vendorRef`
  * Manage own products and orders only

---

## 🌐 API Base URLs

| Environment | Base URL                                                     |
| ----------- | ------------------------------------------------------------ |
| Local       | http://localhost:5001/api/v1                                 |
| Production  | https://vendor-management-ebg-assessment.onrender.com/api/v1 |

---

## 📦 Features

* Vendor management (multi-tenant ready)
* Product CRUD with Cloudinary image upload
* Order lifecycle management
* JWT authentication (access + refresh tokens)
* Role-based authorization
* API security (Helmet, rate limiting, validation)
* Analytics dashboard (Recharts)

---

## ⚠️ Important Notes

* Set frontend `.env`:

  ```
  VITE_API_URL=https://vendor-management-ebg-assessment.onrender.com/api/v1
  ```
* Backend hosted on Render (cold start possible)
* Enable CORS for Netlify domain

---
