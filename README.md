# BabyCare - MERN Full-Stack Website

BabyCare is a full-stack e-commerce application for baby products.
It uses a React + Vite frontend and an Express + MongoDB backend.

## Features

- Product browsing with category and keyword filtering
- Product reviews
- Cart and checkout flow
- User authentication with JWT
- Profile management
- Customer order history
- Admin dashboard for products, orders, and users
- User ban/unban support for admin

## Project Structure

```text
BabyCare/
|-- package.json
|-- server.js
|-- vercel.json
|-- backend/
|   |-- server.js
|   |-- middleware/
|   |   |-- auth.js
|   |-- models/
|   |   |-- Order.js
|   |   |-- Product.js
|   |   |-- User.js
|   |-- routes/
|       |-- categories.js
|       |-- orders.js
|       |-- products.js
|       |-- reviews.js
|       |-- users.js
|-- frontend/
    |-- index.html
    |-- package.json
    |-- vite.config.mjs
    |-- src/
        |-- App.jsx
        |-- App.css
        |-- main.jsx
        |-- pages/
        |   |-- AdminPage.jsx
        |   |-- CheckoutPage.jsx
        |   |-- LoginPage.jsx
        |   |-- MyOrdersPage.jsx
        |   |-- ProfilePage.jsx
        |   |-- SignupPage.jsx
        |-- utils/
            |-- api.js
            |-- auth.js
            |-- cart.js
```

## Tech Stack

- Frontend: React, React Router, Vite
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT, bcryptjs

## Local Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Configure environment variables in root `.env`:

```env
MONGO_URI=mongodb://localhost:27017/babycare
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

3. (Optional) Override frontend API URL by setting `VITE_API_URL`.
   If not set, frontend uses the deployed backend URL from `frontend/src/utils/api.js`.

4. Start frontend and backend together:

```bash
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend API health check: http://localhost:5000/api/health

## Available Scripts (Root)

- `npm run dev` - start backend with nodemon
- `npm run client` - start frontend Vite server
- `npm run dev:all` - run backend and frontend together
- `npm run build` - build frontend to `dist`
- `npm run preview:client` - preview built frontend

## API Endpoints

### Products

- `GET /api/products`
- `GET /api/products/top`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/products/:id/reviews` (authenticated)

### Users

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile` (authenticated)
- `PUT /api/users/profile` (authenticated)
- `GET /api/users` (admin)
- `PUT /api/users/:id/ban` (admin)
- `DELETE /api/users/:id` (admin)

### Orders

- `POST /api/orders` (authenticated)
- `GET /api/orders/mine` (authenticated)
- `GET /api/orders/:id` (owner or admin)
- `PUT /api/orders/:id/pay` (owner or admin)
- `PUT /api/orders/:id/status` (admin)
- `GET /api/orders` (admin)
- `DELETE /api/orders/:id` (admin)

### Utility

- `GET /api/categories`
- `GET /api/reviews`
- `GET /api/health`

## Deployment Notes

- Backend start command: `node backend/server.js`
- Vercel build uses root build script and publishes from `dist`
- Backend CORS currently allows deployed frontend domains configured in `backend/server.js`

## Author

Made in Hyderabad, India.
