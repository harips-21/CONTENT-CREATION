# AI Content Studio - Installation & Development Setup Guide

Follow these steps to set up and run AI Content Studio on your local environment.

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## 1. Project Installation

Run the root setup command from the repository root directory:

```bash
# Clone the repository and navigate into the root directory
cd "c:\AI FOR CREATORS"

# Install all dependencies for root, frontend, and backend
npm run install:all
```

Alternatively, you can install dependencies individually:

```bash
# Install root concurrency tools
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## 2. Environment Setup

### Backend `.env` (`backend/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="ai-content-studio-super-secret-jwt-key-2026"
PORT=5000
AI_PROVIDER="mock" # Options: mock | openai | gemini
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## 3. Database Migration & Prisma Setup

Generate Prisma Client and push SQLite database schema:

```bash
cd backend
npx prisma generate
npx prisma db push
```

---

## 4. Running Locally

### Option A: Run Full Stack Simultaneously (Recommended)
From the root directory:
```bash
npm run dev
```
This starts both the backend API (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently.

### Option B: Run Services Separately

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend React App):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser to start using AI Content Studio!
