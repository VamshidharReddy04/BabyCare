# 🍼 BabyCare — MERN Full-Stack Website

> Premium organic baby products platform built with MongoDB, Express, React & Node.js

---

## ✨ Features

| Area              | Details                                                     |
| ----------------- | ----------------------------------------------------------- |
| 🎨 **Frontend**   | React 18 + Vite, Redux Toolkit, Framer Motion, Google Fonts |
| ⚙️ **Backend**    | Express.js REST API, JWT Auth, bcrypt passwords             |
| 🗄️ **Database**   | MongoDB + Mongoose ODM                                      |
| 🛒 **E-Commerce** | Cart, Checkout, Order tracking, Reviews                     |
| 👮 **Auth**       | Register / Login / Admin roles                              |
| 📦 **State**      | Local cart and auth utilities                               |
| 💳 **Payments**   | COD flow hooks                                              |

---

## 📁 Project Structure

```
BabyCare/
├── package.json
├── backend/
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   └── routes/
│       ├── categories.js
│       ├── orders.js
│       ├── products.js
│       ├── reviews.js
│       └── users.js
└── frontend/
   ├── vite.config.mjs
   └── src/
      ├── App.jsx
      ├── App.css
      ├── main.jsx
      ├── index.html
      ├── pages/
      │   ├── AdminPage.jsx
      │   ├── CheckoutPage.jsx
      │   ├── LoginPage.jsx
      │   ├── MyOrdersPage.jsx
      │   ├── ProfilePage.jsx
      │   └── SignupPage.jsx
      └── utils/
         ├── api.js
         ├── auth.js
         └── cart.js
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

Create `.env` in the project root:

```env
MONGO_URI=mongodb://localhost:27017/babycare
JWT_SECRET=your_super_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

You can copy from `.env.example`.

Create `.env.local` for the frontend API base URL:

```env
VITE_API_URL=http://localhost:5000
```

You can copy from `.env.local.example`.

### 3. Run Dev Servers

```bash
npm run dev:all
```

Frontend → http://localhost:5173
Backend API → http://localhost:5000/api

---

## 🚀 MERN Project Deployment (Steps Only)

### 🔹 Backend Deployment (Render)

1. Push backend code to GitHub.
2. Go to Render and create account.
3. Click New Web Service and connect GitHub repo.
4. Select backend folder/project (for this repo, use root directory).
5. Set Build Command: `npm install`.
6. Set Start Command: `node backend/server.js`.
7. Add environment variables:
   MONGO_URI
   JWT_SECRET
   NODE_ENV=production
   CLIENT_URL (your frontend URL later)
8. Deploy and copy backend live URL.

### 🔹 Frontend Deployment (Vercel)

1. Replace all API URLs (localhost) with backend live URL.
2. Push updated frontend code to GitHub.
3. Go to Vercel.
4. Import GitHub repository.
5. Add environment variable (if used):
   VITE_API_URL=your_backend_url
6. Click Deploy.
7. Copy frontend live URL.

### 🔹 Final Connection

1. Update backend CORS with frontend URL.
2. Redeploy backend (if changed).
3. Test full app (Login, Cart, Orders).

Important:

- Do not upload `node_modules` to GitHub or Vercel.
- Vercel installs dependencies automatically from `package.json`.

---

## 🔌 API Endpoints

### Products

| Method | Endpoint                    | Access |
| ------ | --------------------------- | ------ |
| GET    | `/api/products`             | Public |
| GET    | `/api/products/top`         | Public |
| GET    | `/api/products/:id`         | Public |
| POST   | `/api/products`             | Admin  |
| PUT    | `/api/products/:id`         | Admin  |
| DELETE | `/api/products/:id`         | Admin  |
| POST   | `/api/products/:id/reviews` | Auth   |

### Users

| Method | Endpoint              | Access |
| ------ | --------------------- | ------ |
| POST   | `/api/users/register` | Public |
| POST   | `/api/users/login`    | Public |
| GET    | `/api/users/profile`  | Auth   |
| PUT    | `/api/users/profile`  | Auth   |

### Orders

| Method | Endpoint                 | Access |
| ------ | ------------------------ | ------ |
| POST   | `/api/orders`            | Auth   |
| GET    | `/api/orders/mine`       | Auth   |
| GET    | `/api/orders/:id`        | Auth   |
| PUT    | `/api/orders/:id/pay`    | Auth   |
| GET    | `/api/orders`            | Admin  |
| PUT    | `/api/orders/:id/status` | Admin  |

---

## 🎨 Design System

| Token            | Value                       |
| ---------------- | --------------------------- |
| `--cream`        | `#fdf6ee` — page background |
| `--blush`        | `#f7c5b0` — soft accent     |
| `--peach`        | `#f4a07a` — primary brand   |
| `--sage`         | `#a8c5a0` — organic green   |
| `--sky`          | `#b5d8f0` — light blue      |
| `--lavender`     | `#cdb4db` — gentle purple   |
| **Display font** | Playfair Display            |
| **Body font**    | DM Sans                     |

---

## 🛠️ Tech Stack

```
Frontend      Backend        Database      Dev Tools
────────────  ─────────────  ─────────────  ─────────────
React 18      Express 4.21   MongoDB       Vite
React Router  Mongoose 8     Atlas / Local  Nodemon
CSS           JWT + bcryptjs CORS + dotenv  npm scripts
```

---

## 📱 Pages Overview

1. **Home** — Hero, Categories, Bestsellers, Features, Testimonials, Newsletter
2. **Product Detail** — Image gallery, Add to cart, Reviews, Related products
3. **Cart** — Items, qty controls, price summary, promo codes
4. **Checkout** — Address form → Payment → Order summary
5. **Order Tracking** — Status timeline, Items, Invoice download
6. **Auth** — Login / Register with validation
7. **Admin Dashboard** — Stats cards, Product CRUD, Order management

---

## 💖 Made with love in Hyderabad, India
