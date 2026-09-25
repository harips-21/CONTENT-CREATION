# AI Content Studio - REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. User Registration
`POST /auth/register`

**Request Body:**
```json
{
  "name": "Alex Rivera",
  "email": "alex@brand.com",
  "password": "StrongPassword123!"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful.",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "uuid-v4",
    "name": "Alex Rivera",
    "email": "alex@brand.com"
  }
}
```

---

### 2. User Login
`POST /auth/login`

**Request Body:**
```json
{
  "email": "alex@brand.com",
  "password": "StrongPassword123!"
}
```

---

### 3. User Profile
`GET /auth/profile`
Header: `Authorization: Bearer <JWT_TOKEN>`

`PUT /auth/profile`
Header: `Authorization: Bearer <JWT_TOKEN>`

---

## Campaign Endpoints

### 1. Create Campaign & Generate Content
`POST /campaigns`
Header: `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "brandName": "Aura Luxe",
  "productName": "Aura Smart Watch Series V",
  "industry": "Wearable Technology",
  "audience": "Minimalist professionals aged 22-45",
  "goal": "Product Launch",
  "tone": "Luxury",
  "platform": "Instagram",
  "keywords": "SmartWatch, LuxuryTech",
  "callToAction": "Order now for VIP pricing."
}
```

**Response (201 Created):**
Returns created campaign record alongside 8 generated content items (`CAPTION`, `HASHTAGS`, `AD_COPY`, `BLOG`, `EMAIL`, `IMAGE_PROMPT`, `VIDEO_SCRIPT`, `VOICE_OVER`).

---

### 2. Get All User Campaigns
`GET /campaigns`
Header: `Authorization: Bearer <JWT_TOKEN>`

---

### 3. Get Single Campaign
`GET /campaigns/:id`
Header: `Authorization: Bearer <JWT_TOKEN>`

---

### 4. Delete Campaign
`DELETE /campaigns/:id`
Header: `Authorization: Bearer <JWT_TOKEN>`

---

## Generation Endpoints

### 1. Direct AI Generation
`POST /generate`

---

### 2. Regenerate Single Format
`PUT /generate/regenerate`
```json
{
  "campaignId": "uuid-v4",
  "type": "CAPTION",
  "input": { ... }
}
```
