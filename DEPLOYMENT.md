# Nura Health — Deployment Guide

Deploy both the backend ML API and frontend web app to production — **completely free**.

---

## 🚀 Quick Overview

| Component | Platform | URL | Cost | Cold Start |
|---|---|---|---|---|
| **Backend (FastAPI)** | 🤗 Hugging Face Spaces | `https://username-nura-api.hf.space` | **FREE** | ~2 min first time |
| **Frontend (Next.js)** | Vercel | `https://nura-health.vercel.app` | **FREE** | Instant |
| **Database** | Neon (PostgreSQL) | `postgres://...` | **FREE (0.5GB)** | Instant |

**Total cost: $0/month** ✨

---

## 📋 Prerequisites

1. **GitHub account** — [github.com](https://github.com)
2. **Vercel account** (free) — [vercel.com](https://vercel.com)
3. **Hugging Face account** (free) — [huggingface.co](https://huggingface.co)
4. **Neon account** (free PostgreSQL) — [neon.tech](https://neon.tech)
5. Your repo pushed to GitHub

---

## Part 1: Deploy the Backend on Hugging Face Spaces

### Step 1: Create a Hugging Face Space

1. **Go to** [huggingface.co/spaces](https://huggingface.co/spaces)
2. **Click** "Create new Space"
3. **Fill in:**
   - **Space name:** `nura-api`
   - **License:** Apache 2.0
   - **Space SDK:** Docker
   - **Visibility:** Public
4. **Create Space** → you'll get a repo URL like `https://huggingface.co/spaces/YOUR_USERNAME/nura-api`

### Step 2: Add a Dockerfile

In your GitHub repo, create `nurahealth_backend/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install
COPY nurahealth_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY nurahealth_backend /app

# Expose port
EXPOSE 7860

# Run FastAPI with gunicorn for production
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:7860", "--timeout", "0", "api.main:app"]
```

### Step 3: Push to Hugging Face Space

1. **Clone the HF Space repo:**
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/nura-api
   cd nura-api
   ```

2. **Copy your backend code:**
   ```bash
   cp -r /Users/carineash/Nurahealth/nurahealth_backend/* .
   ```

3. **Push to HF:**
   ```bash
   git add .
   git commit -m "Deploy Nura Health API"
   git push
   ```

4. **Wait for build** (2–5 minutes)
   - HF automatically builds the Docker image
   - Your API will be live at: `https://YOUR_USERNAME-nura-api.hf.space`

### Step 4: Test the Backend

```bash
curl https://YOUR_USERNAME-nura-api.hf.space/health
```

**Expected response:**
```json
{"status": "healthy", "model_ready": true}
```

---

## Part 2: Deploy the Frontend on Vercel

### Step 1: Connect to Vercel

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign in** with GitHub
3. **Click** "Add New..." → "Project"
4. **Import** your `nura-health` repo
5. **Select root directory:** `nurahealth_frontend`
6. **Framework:** Next.js (auto-detected)

### Step 2: Set Environment Variables

In Vercel, go to **Settings** → **Environment Variables** and add:

```
ML_API_URL=https://YOUR_USERNAME-nura-api.hf.space
DATABASE_URL=postgresql://user:pass@host/nura
AUTH_SECRET=<your-random-secret>
```

**To generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Deploy

1. **Click** "Deploy"
2. **Wait** for build (2–3 minutes)
3. **Your frontend is live at:** `https://nura-health-xxxxx.vercel.app`

---

## Part 3: Set up the Database (Neon PostgreSQL)

### Step 1: Create Neon Database

1. **Go to** [neon.tech](https://neon.tech)
2. **Sign up** (free)
3. **Create a new project**
4. **Copy the connection string** — looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-1.neon.tech/nurahealth
   ```

### Step 2: Update Vercel Environment

1. **In Vercel project settings**, update:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/nurahealth
   ```

2. **Redeploy** Vercel:
   ```bash
   cd /Users/carineash/Nurahealth/nurahealth_frontend
   git push  # or click Redeploy in Vercel
   ```

### Step 3: Initialize Database

```bash
export DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.neon.tech/nurahealth"
cd /Users/carineash/Nurahealth/nurahealth_frontend

# Run migrations
npx prisma db push

# Seed demo account
npx prisma db seed
```

**Verify:** Log in at your Vercel URL with `demo.chw@nura.rw` / `Demo@12345`

---

## Part 4: Verify Everything Works

### Frontend ✅
```
https://YOUR-APP.vercel.app/login
```
Should load instantly.

### Backend Health Check ✅
```bash
curl https://YOUR_USERNAME-nura-api.hf.space/health
```

### Full Screening Test ✅
1. Go to frontend
2. Log in
3. Click "New Screening"
4. Enter measurements
5. Click "Analyse"
6. Should show result from HF backend

**If it works, you're done! 🎉**

