# Multi-Vendor E-commerce Admin Panel - Backend

Production-grade Node.js/Express backend with MongoDB, JWT authentication, role-based access control, and modular architecture.

## Folder Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           (JWT, registration, login, refresh)
│   │   ├── vendor/         (Vendor CRUD + search/filter/paginate)
│   │   ├── product/        (Product CRUD + image upload)
│   │   ├── order/          (Order management + stock management)
│   │   └── analytics/      (Dashboard metrics + monthly revenue)
│   ├── common/
│   │   ├── middlewares/    (Auth, roles, validation, error handling)
│   │   ├── utils/          (Pagination, search/filter, Cloudinary)
│   │   ├── constants/      (Roles, HTTP status codes)
│   │   └── validators/     (Joi schemas)
│   ├── config/             (Environment, database config)
│   ├── database/           (MongoDB connection)
│   ├── routes/             (Router aggregation)
│   ├── app.js              (Express app setup)
│   └── server.js           (HTTP server + DB connection)
├── package.json
└── .env.example
```

## Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Environment Setup**
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Required environment variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: Strong secret key
- `JWT_REFRESH_SECRET`: Strong refresh secret key
- `CLOUDINARY_*`: Cloudinary credentials (for image uploads)
- `PORT`: Server port (default: 5001)

3. **Run Development Server**
```bash
npm run dev
```

Production server:
```bash
npm start
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token

### Auth (continued)
- `GET /api/v1/auth/me` - Current user profile
- `POST /api/v1/auth/logout` - Invalidate refresh token

### Vendors (Admin only)
- `GET /api/v1/vendors?search=name&page=1&limit=20&sortBy=createdAt&order=desc` - List vendors
- `POST /api/v1/vendors` - Create vendor
- `GET /api/v1/vendors/:id` - Get vendor details
- `PATCH /api/v1/vendors/:id` - Update vendor
- `DELETE /api/v1/vendors/:id` - Delete vendor

### Products (Admin + Vendor)
- `GET /api/v1/products?search=title&page=1&limit=20` - List products (vendor-scoped)
- `POST /api/v1/products` - Create product (multipart `image` field)
- `GET /api/v1/products/:id` - Get product details
- `PATCH /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Orders (Admin + Vendor)
- `GET /api/v1/orders?vendor=id&status=pending&page=1&limit=20` - List orders (vendor-scoped)
- `POST /api/v1/orders` - Create order (stock validation)
- `GET /api/v1/orders/:id` - Get order details
- `PATCH /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id` - Delete order (admin, pending/cancelled only)

### Analytics (Admin only)
- `GET /api/v1/analytics/totals` - Dashboard totals
- `GET /api/v1/analytics/monthly?months=6` - Monthly revenue graph

## Authentication

All protected endpoints require `Authorization: Bearer <accessToken>` header.

Roles:
- `admin`: Full access to all endpoints
- `vendor`: Access to vendors (own), products, orders

## Architecture Principles

- **Controller**: Request/response handling only
- **Service**: Business logic implementation
- **Repository**: Database queries
- **Middleware**: Request validation, authentication, error handling
- **Utilities**: Reusable pagination, search/filter, image upload

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT with access + refresh tokens
- Role-based access control (RBAC)
- Input validation with Joi schemas
- NoSQL injection prevention (express-mongo-sanitize)
- XSS protection (xss-clean)
- Security headers (Helmet)
- Rate limiting
- Environment variables for secrets

## Error Handling

Centralized error middleware returns consistent error responses:
```json
{
  "message": "Error description",
  "details": "Optional validation errors"
}
```

## Database Models

### User
- name, email, password, role (admin/vendor), vendorRef, refreshTokens

### Vendor
- name, email, phone, address, isActive, timestamps

### Product
- title, description, price, vendor, images (URLs), stock, categories, isPublished, timestamps

### Order
- vendor, user, items (product, qty, price), subtotal, total, status, shipping, timestamps
