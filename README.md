# AI Content Studio for Brands & Creators 🚀

AI Content Studio is a full-stack SaaS platform designed to transform simple brand or product ideas into publish-ready content tailored for multiple platforms powered by **Google Gemini API** (with automatic Demo Mode fallback).

![AI Content Studio Stack](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20API-emerald)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Express%20%7C%20Prisma-blue-purple)

## 🌟 Key Features

- **Real Google Gemini API Integration**: Leverages Gemini (`gemini-2.5-flash` or custom model) from Node.js backend for structured, multi-format content generation.
- **Automatic Fallback to Demo Mode**: If `GEMINI_API_KEY` is not provided, the system automatically runs in Demo Mode via `MockAIProvider` without breaking app functionality.
- **8 Supported Formats**:
  1. **Social Media Captions**: Emoji-rich, platform-specific short & long captions with CTAs.
  2. **Hashtag Clusters**: Trending, niche, brand, and campaign hashtags formatted as copyable chips.
  3. **High-Converting Ad Copy**: Headlines, primary text, short & long ad angles.
  4. **SEO Blog Content**: Catchy titles, meta outlines, introductions, subheadings, and conclusions.
  5. **Email Marketing**: Subject lines, preview text, email body templates, and CTAs.
  6. **AI Visual Prompts**: Formatted prompts for DALL-E 3, Midjourney v6, and Stable Diffusion (lighting, camera angles, styles).
  7. **Short Video Scripts**: 15–30s TikTok/Reels blueprints with hooks, visual scenes, on-screen text, and voiceovers.
  8. **Voice-over Scripts**: Conversational narration with pause markers (`[pause 1s]`) and emphasis guides.
- **Dynamic AI Status KPI**: Displays 🟢 **Gemini Connected** or 🟡 **Demo Mode** on the Dashboard.
- **Content Studio & Versioning**: Tabbed studio interface, inline editing, version history preservation in Prisma DB, copy-to-clipboard, and targeted regeneration.
- **Export Engine**: One-click download as plain TXT or formatted PDF reports.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (White background, Blue-Purple gradients, Glassmorphism)
- **Icons**: Lucide React
- **HTTP & Exports**: Axios, jsPDF

### Backend
- **Server**: Node.js, Express, TypeScript
- **AI Integration**: Native Google Gemini REST API (`gemini-2.5-flash`)
- **Database**: Prisma ORM with SQLite (PostgreSQL compatible)
- **Security**: JWT Authentication, bcrypt password hashing

---

## ⚡ Quick Start & Gemini API Setup

### 1. Configure Gemini API Key
Create a `.env` file inside `backend/.env`:

```env
PORT=5000
JWT_SECRET="ai-content-studio-super-secret-jwt-key-2026"
DATABASE_URL="file:./dev.db"

# Google Gemini Configuration
GEMINI_API_KEY="your_real_gemini_api_key_here"
GEMINI_MODEL="gemini-2.5-flash"
AI_PROVIDER="gemini"
```

> **Note**: Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/). If `GEMINI_API_KEY` is left blank, the app will automatically operate in **Demo Mode**.

### 2. Run Application
```bash
# 1. Install dependencies across root, frontend, and backend
npm run install:all

# 2. Setup Prisma Database
cd backend
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma db push --schema=src/prisma/schema.prisma
cd ..

# 3. Start development server (Frontend + Backend concurrently)
npm run dev
```

Visit `http://localhost:5173` to launch AI Content Studio.

---

## 📄 Documentation

- [Installation & Dev Setup](docs/INSTALLATION.md)
- [API Endpoints Documentation](docs/API_DOCUMENTATION.md)
