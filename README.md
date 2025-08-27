# 📹 TalkSphere – Full Stack Real-Time Video Conferencing Platform

[![Website](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge\&logo=vercel)](https://full-stack-real-time-video-conferencing-5r1k.onrender.com)

---

## 🚀 Overview

**TalkSphere** is a **full-stack, real-time video conferencing platform** built on **mesh topology** that enables seamless **multi-user video calls, chat, and AI-powered fun conversations**.

With **WebRTC** handling peer-to-peer communication and **Socket.IO** for signaling, TalkSphere ensures **low-latency, high-quality conferencing**. The platform also features **screen sharing, camera/audio toggle, and multi-user room support**.

Additionally, it integrates **Gemini API** to provide a **funny AI chatbot** alongside your meetings!

---

# ✨ Features

## 🎯 Core Video Conferencing Functionality
- **Multi-User Rooms** – Create and join rooms with multiple participants using mesh topology  
- **Video & Audio Conferencing** – High-quality, real-time video and audio communication via WebRTC  
- **Screen Sharing** – Share your screen for presentations and collaboration  
- **Chat Messaging** – Real-time group chat powered by Socket.IO  
- **Media Controls** – Toggle microphone and camera on/off during meetings  

## 🤖 Advanced Features
- **AI-Powered Chatbot** – Integrated Gemini API chatbot for fun and interactive conversations  
- **Secure Authentication** – OAuth 2.0 & JWT-based login/register for user security  
- **Room Management** – Unique room links and secure room joining  
- **Real-Time Status** – Instant updates on participants joining/leaving  
- **Multi-Device Support** – Works seamlessly across desktop and mobile  

## ⚙️ Technical Features
- **MVC Architecture** – Clean and scalable backend with Express.js & Node.js  
- **Responsive Design** – Modern, mobile-first UI built with React.js & CSS  
- **RESTful APIs** – Well-structured APIs for authentication and data flow  
- **Real-Time Communication** – WebRTC for media streaming + Socket.IO for signaling  
- **Security First** – JWT authentication, OAuth 2.0 integration, input validation, and CORS protection  
- **Production Ready** – Docker & Docker Compose support with deployment on Render  


## 🏗 Architecture

The platform follows a **client-server model** with **MVC architecture** on the backend:

```
                   ┌────────────────────────┐
                   │        Frontend         │
                   │  React.js + Router      │
                   │  Axios + CSS            │
                   └───────────┬────────────┘
                               │
                               ▼
                   ┌────────────────────────┐
                   │        Backend          │
                   │ Node.js + Express.js    │
                   │ OAuth 2.0 + JWT         │
                   │ MVC Pattern             │
                   └───────────┬────────────┘
                               │
                               ▼
                   ┌────────────────────────┐
                   │ Real-Time Engine        │
                   │ WebRTC + Socket.IO      │
                   └───────────┬────────────┘
                               │
                               ▼
                   ┌────────────────────────┐
                   │   AI Chatbot (Gemini)   │
                   └────────────────────────┘
```

---

## 📸 Demo

🎥 **Loom Video Walkthrough**: *\[Placeholder – Add your Loom link here]*

🌐 **Live Demo**: [TalkSphere on Render](https://full-stack-real-time-video-conferencing-5r1k.onrender.com)

---

# 🛠 Tech Stack & AI Tools

## 🎨 Frontend Technologies
- **React 18** – Modern JavaScript library with hooks  
- **React Router v6** – Client-side routing for seamless navigation  
- **Axios** – HTTP client for API communication  
- **JWT Authentication** – Secure login/register system integration  
- **CSS3** – Modern styling with Flexbox/Grid & fully responsive design  

## ⚙️ Backend Technologies
- **Node.js 18+** – JavaScript runtime environment  
- **Express.js** – Fast, unopinionated web framework  
- **MongoDB** – NoSQL document database for storing user data, rooms, and chat messages  
- **Mongoose** – Elegant MongoDB object modeling for Node.js  
- **OAuth 2.0 + JWT** – Secure authentication & authorization  
- **MVC Architecture** – Clean, scalable backend structure  

## 🌐 Real-Time Communication
- **WebRTC** – Peer-to-peer audio/video streaming  
- **Socket.IO** – Real-time signaling & chat messaging  
- **Mesh Topology** – Efficient peer connections for multi-user rooms  

## 🤖 AI Integration
- **Google Gemini API** – Advanced AI for:  
  - Fun chatbot interactions during meetings  
  - Contextual & engaging responses  
  - Natural language understanding  

## ☁️ Cloud Services & DevOps
- **Render** – Deployment platform for frontend & backend  
- **Docker & Docker Compose** – Containerization & multi-service orchestration  
- **Environment Management** – dotenv for secure environment variables  

## 🛠 Development Tools
- **ESLint** – Code linting & style enforcement  
- **Nodemon** – Development server auto-restart  
- **CORS** – Secure cross-origin communication  
- **Git & GitHub** – Version control & collaboration  

---

## 📂 Project Structure

```
.
├── CLIENT
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   ├── image.jpg
│   │   └── vite.svg
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Authentication
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── CreateComponent.jsx
│   │   │   ├── DashBoard
│   │   │   │   ├── DashBoard.jsx
│   │   │   │   └── SideBar.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Meeting.jsx
│   │   │   └── VideoComponent.jsx
│   │   └── styles
│   │       ├── Authentication
│   │       │   ├── Login.css
│   │       │   └── Signup.css
│   │       ├── Home.css
│   │       ├── MeetingComponent.css
│   │       └── VideoComponent.css
│   ├── static.json
│   └── vite.config.js
└── SERVER
    ├── Util
    │   └── ScecretToken.js
    ├── controllers
    │   ├── AiController.js
    │   ├── socketManger.js
    │   └── userController.js
    ├── index.js
    ├── middlewares
    │   └── Authmiddlewares.js
    ├── models
    │   └── userModel.js
    ├── package.json
    └── routes
        ├── aiRoutes.js
        └── userRoutes.js
```
#📦 Key Dependencies
```bash
@emotion/react: ^11.14.0
@emotion/styled: ^11.14.0
@mui/icons-material: ^7.1.0
@mui/material: ^7.1.0
@tailwindcss/vite: ^4.1.12
axios: ^1.10.0
dotenv: ^17.2.1
js-cookie: ^3.0.5
lucide-react: ^0.513.0
react: ^19.1.0
react-dom: ^19.1.0
react-router-dom: ^7.6.2
socket.io-client: ^4.8.1
tailwindcss: ^4.1.12
uuid: ^11.1.0
```
---

## ⚙️ Local Setup Instructions  

### 🔑 Prerequisites  
- **Node.js 18+**  
- **Docker & Docker Compose** (recommended)  
- **MongoDB** (local installation or Atlas account)  
- **Google Cloud Console** (for OAuth setup)  
- **Google AI Studio account** (for Gemini API key)  

---

### 🐳1st Way: Docker Development (Recommended)  

1️⃣ Clone the repository  
```bash
git clone <your-repo-url>
cd FULL-STACK-REAL-TIME-VIDEO-CONFERENCING-PLATFORM
```
2️⃣ Set up environment variables
```bash
Create .env file in server/:
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_32_characters_minimum
OAUTH_CLIENT_ID=your_google_oauth_client_id
OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
GEMINI_API_KEY=your_gemini_api_key

Create .env file in client/:
VITE_API_URL=http://localhost:3000
```

3️⃣ Run with Docker
```bash
# Update docker-compose.yml with your environment variables
docker-compose up --build
```

4️⃣ Access the application
```bash
Frontend: http://localhost:5173

Backend API: http://localhost:3000
```
---

### 🐳2nd Way: Run the app manually
Install dependencies
```bash
# Backend dependencies
cd SERVER
npm install

# Frontend dependencies
cd CLIENT
npm install
```
Set up environment variables (same as Docker option)

Start services manually

### Terminal 1: Start frontend
```bash
cd CLIENT
npm run dev
```

### Terminal 2: Start backend
```
cd SERVER
nodemon index.js
```

### Access Your Application
```bash
Access the application
Frontend: http://localhost:5173
Backend API: http://localhost:3000
```
---
### Required Service Setup

Google AI Setup
Go to Google AI Studio
Create an API key for Gemini
Add the key to your environment variables

### Database Setup

MongoDB Atlas: Create a database and get connection string

---
## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request 🚀

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify with attribution.

---

## 💡 Future Improvements

* 📼 Add **meeting recording & playback**
* 📊 Add **analytics dashboard** for room stats
* 🌍 Implement **global STUN/TURN servers** for better connectivity
* 📱 Add **mobile-friendly UI**

---

## 👨‍💻 Author

**Adarsh Dubey**

* 💼 MERN Stack Developer | Java + DSA | DevOps Learner
* 🌐 [LinkedIn](https://linkedin.com/adarshdubey20) | [GitHub](https://github.com/ADARSHDUBEY200)

---
