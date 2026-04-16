# 🍼 BabyCare — MERN Full-Stack Website

> Premium baby products platform built with MongoDB, Express, React, and Node.js

---

## ✨ Features

| Area              | Details                                                     |
| ----------------- | ----------------------------------------------------------- |
| 🎨 **Frontend**   | React 18 + Vite, responsive pages, protected route handling |
| ⚙️ **Backend**    | Express REST API, JWT auth, bcrypt password hashing         |
| 🗄️ **Database**   | MongoDB with Mongoose ODM                                   |
| 🛒 **E-Commerce** | Product catalog, cart, checkout, orders, reviews            |
| 👮 **Auth**       | Register, login, profile update, role-based access          |
| 🧑‍💼 **Admin**      | Product and order control, user list + ban/unban            |

---

## 📁 Project Structure

```text
BabyCare/
├── package.json
├── server.js
├── vercel.json
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
    ├── index.html
    ├── package.json
    ├── vite.config.mjs
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
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

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/babycare
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

Optional: set `VITE_API_URL` if you want to override the frontend API base URL.

### 3. Run Frontend + Backend

```bash
npm run dev:all
```

Frontend: http://localhost:5173
Backend health: http://localhost:5000/api/health

---

## 🛠️ Available Scripts (Root)

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run dev`            | Start backend with nodemon        |
| `npm run client`         | Start Vite frontend dev server    |
| `npm run dev:all`        | Run backend and frontend together |
| `npm run build`          | Build frontend to `dist`          |
| `npm run preview:client` | Preview production frontend build |

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
| GET    | `/api/users`          | Admin  |
| PUT    | `/api/users/:id/ban`  | Admin  |
| DELETE | `/api/users/:id`      | Admin  |

### Orders

| Method | Endpoint                 | Access         |
| ------ | ------------------------ | -------------- |
| POST   | `/api/orders`            | Auth           |
| GET    | `/api/orders/mine`       | Auth           |
| GET    | `/api/orders/:id`        | Owner or Admin |
| PUT    | `/api/orders/:id/pay`    | Owner or Admin |
| PUT    | `/api/orders/:id/status` | Admin          |
| GET    | `/api/orders`            | Admin          |
| DELETE | `/api/orders/:id`        | Admin          |

### Utility

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | `/api/categories` | Public |
| GET    | `/api/reviews`    | Public |
| GET    | `/api/health`     | Public |

---

## ☁️ Deployment Notes

- Backend start command: `node backend/server.js`
- Vercel uses root build command and serves from `dist`
- CORS allowlist is configured in `backend/server.js`

---

## 💖 Author

Made with care in Hyderabad, India.
