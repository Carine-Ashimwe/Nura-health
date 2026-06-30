# 🚀 Deploy Nura Health — Step by Step

**Total time:** ~30 minutes  
**Cost:** $0 forever ✨

---

## Step 1: Prepare GitHub (5 min)

Make sure everything is committed and pushed:

```bash
cd /Users/carineash/Nurahealth
git add .
git commit -m "Ready for deployment"
git push origin main
```

Verify on GitHub: https://github.com/YOUR_USERNAME/nura-health

---

## Step 2: Create Hugging Face Space (10 min)

### 2a. Create the Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Fill:
   - **Space name:** `nura-api`
   - **Space SDK:** Docker
   - **Visibility:** Public
4. Click **"Create Space"**

You'll get: `https://huggingface.co/spaces/YOUR_USERNAME/nura-api`

### 2b. Add Dockerfile

In your GitHub `nurahealth_backend/` folder, create `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 7860

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:7860", "--timeout", "0", "api.main:app"]
```

Push to GitHub:
```bash
git add nurahealth_backend/Dockerfile
git commit -m "Add Dockerfile for HF deployment"
git push
```

### 2c. Sync to Hugging Face

Clone the HF Space:
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/nura-api
cd nura-api
```

Copy your backend:
```bash
cp -r /Users/carineash/Nurahealth/nurahealth_backend/* .
```

Push to HF (this triggers the build):
```bash
git add .
git commit -m "Deploy Nura Health API"
git push
```

**Wait 3–5 minutes** for HF to build. Check the "Logs" tab in your Space.

### ✅ Test
```bash
curl https://YOUR_USERNAME-nura-api.hf.space/health
```

Should return: `{"status": "healthy", "model_ready": true}`

---

## Step 3: Deploy Frontend to Vercel (10 min)

### 3a. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. **Import** your `nura-health` repo
5. **Root directory:** `nurahealth_frontend`
6. Click **"Import"**

### 3b. Set Environment Variables

In the Vercel project, go to **Settings** → **Environment Variables**

Add:
- **ML_API_URL:** `https://YOUR_USERNAME-nura-api.hf.space`
- **AUTH_SECRET:** `YOUR_RANDOM_SECRET` (run: `openssl rand -base64 32`)
- **DATABASE_URL:** `postgresql://user:pass@host/nura` (from Neon, see Step 4)

### 3c. Deploy

Click **"Deploy"** button. Wait 2–3 minutes.

Your URL: `https://nura-health-xxxxx.vercel.app`

---

## Step 4: Create Database (Neon) (5 min)

### 4a. Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. **Create project**
4. Copy your connection string: `postgresql://user:pass@ep-xxx.neon.tech/nurahealth`

### 4b. Add to Vercel

In Vercel, update **DATABASE_URL** env var with the Neon connection string.

Click **"Save"** → Vercel auto-redeploys.

### 4c. Initialize Database

```bash
export DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/nurahealth"

cd /Users/carineash/Nurahealth/nurahealth_frontend

# Run migrations
npx prisma db push

# Seed demo account
npx prisma db seed
```

---

## Step 5: Verify Everything (5 min)

### ✅ Backend
```bash
curl https://YOUR_USERNAME-nura-api.hf.space/health
```

### ✅ Frontend
Open: `https://nura-health-xxxxx.vercel.app`

### ✅ Login
Email: `demo.chw@nura.rw`  
Password: `Demo@12345`

### ✅ Full Test
1. Click **"New Screening"**
2. Enter: weight `8.3`, height `70.6`, MUAC `10.2`, age `18`
3. Click **"Analyse"**
4. Should show **"Severely Wasted"** result from HF backend

---

## 🎉 Done!

Your app is live:
- **Frontend:** https://nura-health-xxxxx.vercel.app
- **Backend:** https://YOUR_USERNAME-nura-api.hf.space
- **Database:** Neon (managed)

**Total cost: $0/month**

All changes auto-deploy on git push.

---

## 📋 Environment Variables Cheat Sheet

```bash
# Vercel env vars (Settings → Environment Variables)
ML_API_URL=https://YOUR_USERNAME-nura-api.hf.space
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/nurahealth
AUTH_SECRET=YOUR_RANDOM_32_CHAR_SECRET

# Generate AUTH_SECRET
openssl rand -base64 32

# Local testing
export DATABASE_URL="postgresql://..."
npx prisma db push
npx prisma db seed
```

---

## 🐛 If Something Goes Wrong

| Issue | Fix |
|---|---|
| Backend returns 404 | Wait 5 min for HF to build, check Logs tab |
| "Cannot connect to ML API" | Verify ML_API_URL in Vercel env vars is correct |
| "Database connection failed" | Check DATABASE_URL format and Neon whitelist |
| Frontend won't load | Check Vercel build logs (Deployments tab) |
| Can't log in | Run `npx prisma db seed` again |

---

## 🚀 Next: Auto-Deploy on Push

After Step 5, just push code to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Frontend: auto-deploys in 1 min (Vercel)
# Backend: auto-deploys in 3–5 min (HF Space)
```

Done! 🎉
