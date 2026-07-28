# 🏏 CricEDGE

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

<p align="center">
  <b>Data-Driven IPL Analytics & Match Prediction Platform</b><br>
  Built with React, TypeScript, Node.js, Express.js and MongoDB.
</p>

---

# 📖 Overview

CricEDGE is a modern full-stack IPL analytics platform designed for cricket fans and data enthusiasts. It provides intelligent match predictions, team analytics, venue insights, live weather integration, player statistics, prediction history, and secure authentication through a clean, responsive dashboard.

---

# 🌐 Live Demo

### 🚀 Frontend

https://cric-edge.vercel.app

### ⚙️ Backend API

https://cricedge.onrender.com

---

# ✨ Features

- 🏏 Data-Driven Match Prediction
- 📊 Team Performance Analytics
- 🤝 Head-to-Head Comparison
- 📈 Recent Team Form Analysis
- 🌤️ Live Weather Integration
- 🏟️ Venue Insights
- 👤 JWT Authentication
- 🔐 Google OAuth Login
- ❤️ Favourite Team Support
- 📜 Prediction History
- 👤 User Profile Management
- 📱 Fully Responsive Design
- ⚡ Fast React + Vite Frontend

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

# 📂 Project Structure

```text
cricEdge/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── assets/
│   ├── hooks/
│   ├── utils/
│   └── styles/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
│
├── public/
├── guidelines/
├── README.md
├── LICENSE
├── vercel.json
├── vite.config.ts
└── package.json
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **server** folder.

## Local Development

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secure_jwt_secret

FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

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
> - Never commit API keys, database credentials or secret keys.
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

Install Frontend

```bash
npm install
```

Install Backend

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

- **Hosting:** Vercel
- **URL:** https://cric-edge.vercel.app

## Backend

- **Hosting:** Render
- **URL:** https://cricedge.onrender.com

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

# 📸 Application Screenshots

> Screenshots will be added soon.

---

# 🔒 Security

- JWT Authentication
- Google OAuth Authentication
- Protected API Routes
- Passwords securely stored using hashing
- Environment Variables
- MongoDB Atlas Secure Connection
- `.env` excluded using `.gitignore`

---

# 📌 Project Status

## ✅ Production Ready

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Render
- ✅ MongoDB Atlas Connected
- ✅ JWT Authentication
- ✅ Google OAuth Authentication
- ✅ Live Weather Integration
- ✅ Team Analytics Dashboard
- ✅ Head-to-Head Comparison
- ✅ Venue Insights
- ✅ Prediction History
- ✅ Responsive UI
- ✅ User Profile Management

---

# 🚀 Future Roadmap

- 🤖 Machine Learning Based Prediction Model
- 📡 Live IPL Score Integration
- 🏏 Player Performance Prediction
- 📊 Advanced Team Analytics
- 📈 Prediction Accuracy Dashboard
- 🌙 Dark Mode
- 📱 Progressive Web App (PWA)
- 📧 Email Notifications
- 📤 Export Prediction History (CSV / PDF)

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for more details.

---

# 👨‍💻 Author

## Ayush Dixit

**GitHub**

https://github.com/dixitayush450-alt

**Repository**

https://github.com/dixitayush450-alt/cricEdge

**LinkedIn**

https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME

---

# 📅 Changelog

## v1.0.0 — Initial Stable Release

### Added

- Full-Stack React + Node.js Architecture
- JWT Authentication
- Google OAuth Login
- IPL Match Prediction
- Team Analytics
- Head-to-Head Comparison
- Venue Insights
- Live Weather Integration
- Prediction History
- User Profile
- Responsive UI
- Vercel Deployment
- Render Deployment
- MongoDB Atlas Integration

---

# 🤝 Contributing

Contributions, feature suggestions, and improvements are always welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

Your support motivates future development and improvements.

---

<p align="center">
  <b>Made with ❤️ by Ayush Dixit</b>
</p>
