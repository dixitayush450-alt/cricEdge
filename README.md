# 🏏 CricEDGE

CricEDGE is a full-stack IPL Analytics and Match Prediction platform built using **React, TypeScript, Node.js, Express.js, and MongoDB**.

The application provides IPL team analytics, player statistics, venue insights, live weather integration, match prediction, prediction history, and secure user authentication through a modern responsive dashboard.

---

# ✨ Features

- 🏏 IPL Match Prediction
- 📊 Team Analytics Dashboard
- 🤝 Head-to-Head Comparison
- 📈 Recent Team Form
- 🌤️ Live Weather Integration
- 🏟️ Venue Analysis
- 👤 User Authentication (JWT)
- 🔐 Google OAuth Login
- ❤️ Favourite Team Support
- 📜 Prediction History
- 📱 Fully Responsive UI
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
- MongoDB
- Mongoose
- Passport.js
- JSON Web Token (JWT)

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
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
├── guidelines/
├── package.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

> **Never upload your real `.env` file or secret keys to GitHub.**

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

# ▶️ Run Locally

Start Backend

```bash
cd server
npm run dev
```

Start Frontend (Open another terminal)

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🔒 Security

- Environment variables are excluded using `.gitignore`
- JWT Authentication
- Google OAuth Authentication
- Protected API Routes
- Secrets are never committed to GitHub

---

# 📌 Future Improvements

- AI-powered Match Prediction
- Live Match Score Integration
- Player Performance Prediction
- Admin Dashboard
- Dark Mode
- Email Notifications

---

# 👨‍💻 Author

**Ayush Dixit**

GitHub:
https://github.com/dixitayush450-alt

---

## ⭐ If you like this project, consider giving it a Star!