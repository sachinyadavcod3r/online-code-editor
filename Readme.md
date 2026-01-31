## 💻 Online Code Editor

## 🌐 Live Demo

> Deployment in progress (Render)


A full-stack online code editor that allows users to write, run, and save code securely with authentication and cloud storage.

---

## 🚀 Features

- 🧠 Multi-language code editor (C++, Java, Python)
- ▶️ Run code directly in the browser
- 💾 Save projects to MongoDB (authenticated users)
- ✏️ Rename and 🗑️ delete saved projects
- 🔐 User authentication (JWT + cookies)
- 🌗 Light / Dark theme toggle
- 📂 My Projects dashboard
- ☁️ MongoDB Atlas cloud database
- ⚙️ Environment-based configuration

---

## 🛠️ Tech Stack

**Frontend**
- HTML, CSS, JavaScript
- CodeMirror Editor
- Bootstrap

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

**DevOps**
- MongoDB Atlas
- Nodemon
- Environment Variables (`dotenv`)

---

## ⚙️ Setup Instructions


### 1️⃣ Clone the repository  Install dependencies

```bash
git clone https://github.com/sachinyadavcod3r/online-code-editor.git
cd online-code-editor
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create .env file
```bash
PORT=8000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 4️⃣ Start the server
```bash
npm run dev
```

### 5️⃣ Open in browser
```bash
http://localhost:8000
```

## 🧩 Architecture Overview

- Frontend is served as static files from Express
- Backend exposes REST APIs for authentication and code management
- MongoDB Atlas stores users and saved projects
- JWT + cookies are used for secure authentication
- Environment variables manage secrets and configuration




