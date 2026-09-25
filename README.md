# AI Content Studio for Brands & Creators 🚀

AI Content Studio is a full-stack SaaS platform designed to transform simple brand or product ideas into publish-ready content tailored for multiple platforms.

![AI Content Studio Theme](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Express%20%7C%20Prisma-blue-purple)

## 🌟 Key Features

- **Multi-Platform AI Engine**: Generates content tailored for Instagram, LinkedIn, X, TikTok, YouTube, and Facebook.
- **8 Supported Formats**:
  1. **Social Media Captions**: Emoji-rich, platform-specific short & long captions with CTAs.
  2. **Hashtag Clusters**: Trending, niche, brand, and campaign hashtags formatted as copyable chips.
  3. **High-Converting Ad Copy**: Headlines, primary text, short & long ad angles.
  4. **SEO Blog Content**: Catchy titles, meta outlines, introductions, subheadings, and conclusions.
  5. **Email Marketing**: Subject lines, preview text, email body templates, and CTAs.
  6. **AI Visual Prompts**: Formatted prompts for DALL-E 3, Midjourney v6, and Stable Diffusion (lighting, camera angles, styles).
  7. **Short Video Scripts**: 15–30s TikTok/Reels blueprints with hooks, visual scenes, on-screen text, and voiceovers.
  8. **Voice-over Scripts**: Conversational narration with pause markers (`[pause 1s]`) and emphasis guides.
- **Content Studio & Versioning**: Tabbed studio interface, inline editing, version history preservation, and copy-to-clipboard actions.
- **Export Engine**: One-click download as plain TXT or formatted PDF reports.
- **Campaign History & Analytics**: Search, filter by platform/goal, open, duplicate, or delete past campaigns.
- **Modular AI Provider Abstraction**: Switchable provider architecture (`aiProvider.ts`, `openai.ts`, `gemini.ts`, `mockProvider.ts`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (White background, Blue-Purple gradients, Glassmorphism)
- **Icons**: Lucide React
- **HTTP & Exports**: Axios, jsPDF

### Backend
- **Server**: Node.js, Express, TypeScript
- **Database**: Prisma ORM with SQLite (PostgreSQL compatible)
- **Security**: JWT Authentication, bcrypt password hashing

---

## ⚡ Quick Start

```bash
# 1. Install dependencies across root, frontend, and backend
npm run install:all

# 2. Setup Prisma Database
cd backend
npx prisma generate
npx prisma db push
cd ..

# 3. Start development server (Frontend + Backend concurrently)
npm run dev
```

Visit `http://localhost:5173` to launch the application.

---

## 📄 Documentation

- [Installation & Dev Setup](docs/INSTALLATION.md)
- [API Endpoints Documentation](docs/API_DOCUMENTATION.md)
