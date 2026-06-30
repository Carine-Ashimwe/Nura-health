# Nura Health 🩺 — Child Malnutrition Screening

Nura Health helps community health workers (CHWs) in Rwanda screen children under 5
for malnutrition. MUAC is useful because it is quick and inexpensive, but arm
circumference alone is not enough to determine nutritional status. Research shows that
screening based only on MUAC can miss a meaningful share of wasted children. Nura
Health combines MUAC with other indicators — **weight, height, age, and sex** — and
uses machine learning to classify the child as **normal**, **wasted**, or **severely
wasted**, with a confidence score, a Kinyarwanda message, and a recommended action.

---

## 🚀 Live Deployment

The full stack is deployed and running in production (free tier, $0/month):

| Component | Platform | Live URL |
|---|---|---|
| **Web app (frontend)** | Vercel | **<https://nura-health-pi.vercel.app/>** |
| **ML API (backend)** | Hugging Face Spaces (Docker) | <https://carinea-nura-api.hf.space> |
| **Interactive API docs** | Swagger UI | <https://carinea-nura-api.hf.space/docs> |
| **Database** | Neon (PostgreSQL) | managed |

**Try it now** → open the [web app](https://nura-health-pi.vercel.app/) and log in with the demo account:

- **Email:** `demo.chw@nura.rw`
- **Password:** `Demo@12345`

Then start a New Screening (e.g. weight `8.3`, height `70.6`, MUAC `10.2`, age `18`,
sex male) to see a colour-coded result from the live ML model.

### How it fits together

```
  Browser ──▶ Vercel (Next.js app + /api/* routes)
                │  ├─ JWT auth (jose) + Edge middleware
                │  ├─ Prisma ──▶ Neon PostgreSQL  (users, children, screenings)
                │  └─ /api/predict ──▶ Hugging Face Space (FastAPI + XGBoost model)
```

The Next.js frontend never talks to the model directly from the browser — its
`/api/predict` server route proxies to the FastAPI service on Hugging Face, keeping
the model URL server-side.

---

## 📊 Model & Results

- **Best model:** XGBoost — **93.02% accuracy** on real Rwanda DHS 2020 data.
- **Safety metric:** **82% recall** on the severely wasted class.
- **Data:** Rwanda DHS 2019–20 (Children's Recode), labelled with **WHO 2006**
  weight-for-height z-score thresholds.

**Key results on Rwanda DHS 2020 (688 test children):**

| Model | Accuracy | Severely Wasted Recall |
|---|---|---|
| Random Forest | 83.58% | 75% |
| **XGBoost** | **93.02%** | **82%** |
| Voting Ensemble | 91.13% | 78% |

**Metric note:** the 93.02% figure is the model's overall **accuracy**, not precision
or recall. We report **recall** for the severely wasted class separately because
missing a child who needs urgent referral is the most serious error in this setting.

> **GitHub repo:** <https://github.com/Carine-Ashimwe/Nura-health.git>
>
> **Video / demo:** <https://drive.google.com/drive/folders/1i5_dVoWPqasXdEz8PiKOn8MHgMf_nqhx>

---

## 🧱 Tech Stack

| Component | Technology |
|---|---|
| ML training | Python, scikit-learn, XGBoost, SHAP |
| Class balancing | SMOTE (imbalanced-learn) |
| ML API | FastAPI + Uvicorn (Docker on Hugging Face Spaces) |
| Frontend | Next.js 14 + TypeScript + Tailwind (PWA) |
| Auth | JWT session cookies (jose), bcrypt password hashing |
| Database | Prisma + SQLite (local dev) / PostgreSQL — Neon (production) |
| Hosting | Vercel (frontend) · Hugging Face Spaces (backend) · Neon (DB) |
| Data | Rwanda DHS 2020 — Children's Recode (RWKR81DT) |
| Standards | WHO 2006 weight-for-height thresholds |

---

## 📁 Repository Layout

```
Nurahealth/
├── nurahealth_backend/      # Python — ML model, data pipeline, FastAPI API
│   ├── api/main.py          #   FastAPI: /health + /predict/child-malnutrition (Swagger at /docs)
│   ├── notebooks/           #   Full ML training notebook (with saved outputs)
│   ├── models/*.joblib      #   Trained models (XGBoost is the best)
│   ├── data/                #   Cleaned Rwanda DHS CSV + data-prep script
│   ├── outputs/             #   Training plots (EDA, SMOTE, SHAP, confusion matrices)
│   ├── docs/screenshots/    #   Real app interface screenshots
│   └── requirements.txt
│
└── nurahealth_frontend/     # Next.js 14 + TypeScript — the working web app (PWA)
    ├── app/                 #   App Router pages: splash, onboarding, login, register,
    │                        #     home, screening, result, patients, profile
    ├── app/api/             #   Server routes: /api/auth/*, /api/predict, /api/screenings,
    │                        #     /api/children  (predict proxies to the FastAPI model)
    ├── middleware.ts        #   Edge auth guard for protected routes
    ├── prisma/schema.prisma #   Database schema (User, Child, Screening)
    ├── messages/            #   i18n strings — en.json + rw.json (Kinyarwanda)
    ├── scripts/seed.mjs     #   Seeds the demo CHW account
    └── package.json
```

> The Hugging Face Space is deployed from a separate copy of the backend
> (`nurahealth_backend/nura-api/`, ignored by git) that contains only the runtime
> files: `api/main.py`, `models/xgboost.joblib`, a `Dockerfile`, and prod `requirements.txt`.

---

## 💻 Run Locally

> Prerequisites: **Python 3.9+** and **Node.js 18+** (with npm).

### Option A — one command (recommended)

From the repo root:

```bash
./run_demo.sh
```

This creates the Python venv, installs dependencies, prepares the local SQLite
database, seeds the demo account, and starts:

- Backend API → http://127.0.0.1:8000 (Swagger UI at `/docs`)
- Frontend → http://127.0.0.1:3000

Press **Ctrl+C** to stop both.

### Option B — two terminals (manual)

**Terminal 1 — Backend ML API (port 8000)**

```bash
cd nurahealth_backend
python3 -m venv venv
source venv/bin/activate        # Mac/Linux  (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn api.main:app --reload   # Swagger UI at http://127.0.0.1:8000/docs
```

**Terminal 2 — Frontend web app (port 3000)**

```bash
cd nurahealth_frontend
cp .env.example .env            # then edit values if needed (see below)
npm install
npm run db:push                 # create the local SQLite schema
npm run db:seed                 # seed the demo CHW account
npm run dev                     # open http://127.0.0.1:3000
```

### Environment variables (`nurahealth_frontend/.env`)

```
DATABASE_URL="file:./dev.db"          # SQLite for local dev (Neon Postgres in prod)
ML_API_URL="http://127.0.0.1:8000"    # where the FastAPI model is reachable
AUTH_SECRET="change-me"               # secret used to sign JWT sessions
```

In production these become the Neon connection string, the Hugging Face Space URL
(`https://carinea-nura-api.hf.space`), and a long random secret — set in Vercel's
Environment Variables.

---

## 🚢 How It Was Deployed

| Component | Platform | Notes |
|---|---|---|
| **Backend** | Hugging Face Spaces (Docker) | Minimal image: FastAPI + `xgboost.joblib`, served by `uvicorn` on port 7860 |
| **Frontend** | Vercel | Root Directory set to `nurahealth_frontend`; env vars `ML_API_URL`, `AUTH_SECRET`, `DATABASE_URL` |
| **Database** | Neon (PostgreSQL) | `npx prisma db push` creates tables; `node scripts/seed.mjs` seeds the demo user |

Everything redeploys automatically on `git push` to `main`.

---

## 🔌 API Endpoints

**ML backend — FastAPI** (`nurahealth_backend/api/main.py`):

| Method | Path | Purpose |
|---|---|---|
| `GET`  | `/health` | Service + model status |
| `POST` | `/predict/child-malnutrition` | Run the malnutrition classifier |

**App backend — Next.js route handlers** (`nurahealth_frontend/app/api/*`):

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Create a CHW account |
| `POST` | `/api/auth/login` | Log in (JWT session cookie) |
| `POST` | `/api/auth/logout` | Log out |
| `POST` | `/api/predict` | Proxy to the FastAPI classifier (hides `ML_API_URL`) |
| `GET`/`POST` | `/api/children` | List / create child profiles |
| `GET`/`POST` | `/api/screenings` | List / create screening records |

---

## 🗄️ Database Schema (Prisma)

Defined in `nurahealth_frontend/prisma/schema.prisma`:

- **User** — the CHW (name, email, password hash, location: province/district/sector/
  cell/village, reporting facility).
- **Child** — a screened child (name, sex, age in months, caregiver, village),
  linked to the CHW who registered them.
- **Screening** — one screening event (weight, height, MUAC, age, sex, classification,
  confidence), linked to a Child and a User.

SQLite is used locally (`prisma/dev.db`); PostgreSQL (Neon) is used in production —
only `DATABASE_URL` changes.

---

## 📚 Dataset

**Rwanda Demographic and Health Survey (DHS) 2019–20**
Source: [dhsprogram.com](https://dhsprogram.com) · File: RWKR81DT (Children's Recode) ·
3,436 children under 5 after cleaning.

Labels derive from the **WHO 2006 weight-for-height z-score** thresholds:

- WHZ < −3 → severely wasted
- −3 ≤ WHZ < −2 → wasted
- WHZ ≥ −2 → normal

| Column | Description |
|---|---|
| weight_kg | Child weight in kilograms |
| height_cm | Child height in centimetres |
| muac_mm | Mid-upper arm circumference (mm) |
| age_months | Age in months (6–59) |
| sex_encoded | Sex (0=male, 1=female) |
| whz_score | Weight-for-height z-score (ground truth) |
| label | normal / wasted / severely_wasted |

---

## 📱 App Screens

Real screenshots captured from the running Next.js app (iPhone @2x).

| Splash | Onboarding | Login |
|---|---|---|
| ![Splash](nurahealth_backend/docs/screenshots/01_splash.png) | ![Onboarding](nurahealth_backend/docs/screenshots/02_onboarding.png) | ![Login](nurahealth_backend/docs/screenshots/03_login.png) |

| Home | Screening | Result |
|---|---|---|
| ![Home](nurahealth_backend/docs/screenshots/04_home.png) | ![Screening](nurahealth_backend/docs/screenshots/05_screening.png) | ![Result](nurahealth_backend/docs/screenshots/06_result.png) |

| Register | Patients | Profile |
|---|---|---|
| ![Register](nurahealth_backend/docs/screenshots/07_register.png) | ![Patients](nurahealth_backend/docs/screenshots/08_patients.png) | ![Profile](nurahealth_backend/docs/screenshots/09_profile.png) |

**Navigation flow:** Splash → Onboarding → Login / Register → **Home** dashboard →
New **Screening** (5 inputs) → colour-coded **Result** → Patients / Profile (bottom nav).

---

## 📈 Key Outputs

All plots below are produced by running `notebooks/nura_health_model.ipynb` end-to-end.

### Data Exploration
![Data exploration](nurahealth_backend/outputs/01_data_exploration.png)

### Class Balancing (SMOTE)
![SMOTE balancing](nurahealth_backend/outputs/02_smote_balancing.png)

### Model Comparison & Confusion Matrices
![Model comparison](nurahealth_backend/outputs/04_model_comparison.png)
![Confusion matrices](nurahealth_backend/outputs/03_confusion_matrices.png)

### Explainability (SHAP)
![SHAP importance](nurahealth_backend/outputs/05_shap_importance.png)

XGBoost achieves **93.02% accuracy** on the Rwanda DHS 2020 test split, with **82%
recall** on the severely wasted class. SHAP shows **MUAC, weight, and height** are the
most important features for detecting severely wasted children. All API responses also
include a plain-language **Kinyarwanda** message so CHWs receive guidance in their
primary language.
