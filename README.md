# 🛒 Green Cart — Full-Stack E-Commerce Platform

Green Cart is a **production-ready full-stack e-commerce application** built with a modern MERN-based architecture, featuring secure authentication, cart management, address handling, order processing, and Stripe payments.

This project is deployed and fully functional in production.

---

## 🌐 Live URLs

### 🔹 Frontend

👉 [https://green-cart-virid.vercel.app/](https://green-cart-virid.vercel.app/)

### 🔹 Backend API

👉 [https://green-cart-backend-topaz.vercel.app/](https://green-cart-backend-topaz.vercel.app/)

---

## 🚀 Features

### 👤 User Features

* User registration & login (JWT + HTTP-only cookies)
* Persistent authentication (secure cross-site cookies)
* Product browsing & search
* Add / remove products from cart
* Quantity updates with real-time sync
* Address management (add & select delivery address)
* Cash on Delivery (COD) orders
* Online payments using **Stripe Checkout**
* View personal order history

---

### 🧑‍💼 Seller (Admin) Features

* Secure seller login (environment-based credentials)
* Add new products with:

  * Multiple images
  * Category
  * Price & offer price
* View all orders (paid + COD)
* Seller-only protected routes
* No client-side seller spoofing (cookie-based auth)

---

### 💳 Payment System

* Stripe Checkout integration (Test Mode)
* Secure server-side session creation
* Stripe Webhook support
* Automatic order payment verification
* Cart auto-clear after successful payment

---

## 🏗️ Tech Stack

### Frontend

* **React + Vite**
* **Tailwind CSS**
* React Context API (state management)
* Axios (with credentials)
* React Router DOM
* React Hot Toast

### Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* JWT Authentication
* Cookie-based auth (HTTP-only, SameSite=None)
* Stripe SDK
* Cloudinary (image storage)

---

## 🔐 Authentication Architecture (Important)

* Uses **JWT stored in HTTP-only cookies**
* No `userId` is ever sent from frontend
* Backend extracts user identity via middleware (`req.user.id`)
* Fully secure against client-side tampering
* Cross-site cookies configured for Vercel deployment

---


### Seller Credentials (example)

```env
SELLER_EMAIL=admin@gmail.com
SELLER_PASSWORD=admin123
```

### Seller Endpoints

* `POST /api/seller/login`
* `GET /api/seller/is-auth`
* `GET /api/seller/logout`

> ⚠️ Seller routes are protected using a separate `SellerToken` cookie.

---

## 📦 API Overview

### User Routes

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/user/register` | Register user |
| POST   | `/api/user/login`    | Login user    |
| GET    | `/api/user/is-auth`  | Check auth    |
| GET    | `/api/user/logout`   | Logout        |

---

### Product Routes

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/api/product/list` | Get all products          |
| POST   | `/api/product/add`  | Add product (seller only) |

---

### Cart Routes

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| POST   | `/api/cart/update` | Update cart (auth required) |

---

### Address Routes

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/api/address/add` | Add address        |
| GET    | `/api/address/get` | Get user addresses |

---

### Order Routes

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| POST   | `/api/order/cod`    | Place COD order |
| POST   | `/api/order/stripe` | Stripe checkout |
| GET    | `/api/order/user`   | User orders     |
| GET    | `/api/order/seller` | Seller orders   |

---

### Stripe Webhook

```
POST /api/order/webhook
```

Used to:

* Mark orders as paid
* Clear user cart after successful payment

---

## 🔑 Environment Variables

### Backend (`.env`)

```env
PORT=3000
NODE_ENV=production

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

SELLER_EMAIL=admin@greencart.com
SELLER_PASSWORD=strongpassword

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

### Frontend (`.env`)

```env
VITE_BACKEND_URL=https://green-cart-backend-topaz.vercel.app
VITE_CURRENCY=₹
```

---

## 🧪 Stripe Test Card

Use this card for testing payments:

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any
ZIP: Any
```

---

## 🛡️ Security Highlights

* HTTP-only cookies (XSS safe)
* SameSite=None + Secure for cross-domain auth
* JWT verification middleware
* Seller routes fully isolated
* No sensitive IDs exposed to frontend
* Stripe verification via webhook

---

## 📈 Deployment

* **Frontend**: Vercel
* **Backend**: Vercel (Serverless)
* **Database**: MongoDB Atlas
* **Media**: Cloudinary
* **Payments**: Stripe

---

## 👨‍💻 Author

**Lokesh Konka**
Portfolio: [https://lokeshkonka.vercel.app](https://lokeshkonka.vercel.app)