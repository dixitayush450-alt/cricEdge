# 🏏 CricEDGE

<p align="center">
  <b>AI-Powered IPL Analytics & Match Prediction Platform</b><br>
  Built with React, TypeScript, Node.js, Express.js and MongoDB.
</p>

---

## 📖 Overview

CricEDGE is a modern full-stack cricket analytics platform designed for IPL fans and data enthusiasts. It provides intelligent match predictions, team analytics, venue insights, weather integration, player statistics, and secure authentication through a clean, responsive dashboard.

---

# 🌐 Live Demo

### 🚀 Frontend

https://cric-edge.vercel.app

### ⚙️ Backend API

https://cricedge.onrender.com

---

# ✨ Features

- 🏏 AI-Based Match Prediction
- 📊 Team Performance Analytics
- 🤝 Head-to-Head Comparison
- 📈 Recent Team Form Analysis
- 🌤️ Live Weather Integration
- 🏟️ Venue Insights
- 👤 JWT Authentication
- 🔐 Google OAuth Login
- ❤️ Favourite Team Support
- 📜 Prediction History
- 📱 Fully Responsive Design
- ⚡ Lightning Fast React + Vite Frontend

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Passport.js
- JWT Authentication

---

# 📁 Project Structure

```text
cricEdge/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── context/
│   ├── assets/
│   └── styles/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── utils/
│
├── guidelines/
├── package.json
├── vite.config.ts
├── README.md
├── vercel.json
└── .gitignore
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **server** folder.

## Local Development

```env
# ==========================
# Server
# ==========================
PORT=5000

# ==========================
# Database
# ==========================
MONGODB_URI=your_mongodb_atlas_connection_string

# ==========================
# Authentication
# ==========================
JWT_SECRET=your_secure_jwt_secret

# ==========================
# Frontend
# ==========================
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# ==========================
# Google OAuth
# ==========================
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ==========================
# Gmail SMTP
# ==========================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=CricEDGE <your_email@gmail.com>
```

## Production

```env
FRONTEND_URL=https://cric-edge.vercel.app
CLIENT_URL=https://cric-edge.vercel.app
GOOGLE_CALLBACK_URL=https://cricedge.onrender.com/api/auth/google/callback
```

> ⚠️ **Security Notice**
>
> - Never upload your real `.env` file to GitHub.
> - Never commit database credentials, API keys, passwords, or secret keys.
> - Always keep `.env` inside `.gitignore`.

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/dixitayush450-alt/cricEdge.git
```

Move into the project

```bash
cd cricEdge
```

Install frontend dependencies

```bash
npm install
```

Install backend dependencies

```bash
cd server
npm install
```

---

# ▶️ Running the Project

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

Open another terminal

```bash
npm run dev
```

### Frontend

```
http://localhost:5173
```

### Backend

```
http://localhost:5000
```

---

# 🚀 Deployment

## Frontend

- Vercel
- https://cric-edge.vercel.app

## Backend

- Render
- https://cricedge.onrender.com

## Database

- MongoDB Atlas

---

# 🔗 API Base URL

## Production

```
https://cricedge.onrender.com/api
```

## Local Development

```
http://localhost:5000/api
```

---

# 🔒 Security

- JWT Authentication
- Google OAuth Authentication
- Protected API Routes
- Passwords and secrets stored in environment variables
- `.env` excluded using `.gitignore`
- MongoDB Atlas secure connection

---

# 📌 Project Status

✅ Production Ready

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ✅ MongoDB Atlas connected
- ✅ Google OAuth Authentication
- ✅ JWT Authentication
- ✅ Live Weather Integration
- ✅ Match Prediction
- ✅ Prediction History
- ✅ Team Analytics
- ✅ Responsive UI

---

# 🚀 Future Roadmap

- 🤖 Machine Learning Based Prediction Model
- 📡 Live IPL Score Integration
- 🏏 Player Performance Prediction
- 📊 Advanced Team Analytics
- 📈 Prediction Accuracy Dashboard
- 🌙 Dark Mode
- 📧 Email Notifications
- 📱 Progressive Web App (PWA)

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Ayush Dixit**

GitHub:
https://github.com/dixitayush450-alt

Repository:
https://github.com/dixitayush450-alt/cricEdge

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

Your support helps improve the project and motivates future development.
