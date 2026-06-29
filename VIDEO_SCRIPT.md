# 🎬 Nura Health — Video Demo Script

**Read this while you record.** Everything you need to **say** is in the > quote boxes.
Everything you need to **show/click** is in the **SHOW** lines. Target length: **7 minutes**
(the rubric asks for 5–10 minutes).

> ⚠️ Focus on **demonstrating the app working**, not on research background. The grader
> wants to see functionality, clear navigation, and that your tools/environment work.

---

## ✅ Before you press record (so nothing breaks on camera)

1. In the repo root, run **`./run_demo.sh`** and wait until it prints that both servers are up.
2. **Log in once** in the browser before recording (this "warms up" the app so it's instant on camera).
3. Have these tabs/windows open and ready:
   - **App** → `http://localhost:3000`
   - **Swagger API** → `http://localhost:8000/docs`
   - **VS Code** open on the project
   - The notebook **`nurahealth_backend/notebooks/nura_health_model.ipynb`** open, scrolled to the top, with its charts/outputs visible.
4. In the Screening form, remember to **select a child first** (there are demo children already loaded).
5. Always reach the Result screen by going **Screening → Analyse** (don't open `/result` directly).

---

## ⏱️ PART 1 — Introduction (0:00 – 0:35)

**SHOW:** The app open on the splash or home screen.

> "Hi, my name is [YOUR NAME], and this is my project, **Nura Health** — a child-malnutrition
> screening tool for community health workers in Rwanda. MUAC is useful because it is fast,
> but arm circumference alone is not enough to determine nutritional status. Research shows
> that MUAC-only screening can miss a meaningful share of wasted children. My solution takes
> **five quick measurements** — weight, height, MUAC, age, and sex — and uses a
> **machine-learning model** to classify a child as **normal, wasted, or severely wasted**,
> with a confidence score and a recommended action. I'm on the **ML track**, and I built this
> as a full-stack MVP.
> Let me demonstrate it."

---

## ⏱️ PART 2 — Tools & Development Environment (0:35 – 1:15)
### 🎯 Rubric: *Review requirements & tools* + *Development environment setup*

**SHOW:** VS Code file tree → click `nurahealth_backend/requirements.txt` → then `run_demo.sh` → then the terminal showing both servers running.

> "First, the tools and setup. The project is split into a **backend** and a **frontend**.
> The backend is **Python**: I used **pandas** for the data, **scikit-learn** and **XGBoost**
> to train the models, **SHAP** to explain them, and **FastAPI** to serve predictions over an API.
> The frontend is **Next.js 14 with TypeScript, Tailwind CSS, and Prisma** for the database.
>
> Every dependency is pinned in `requirements.txt` and `package.json`, so the environment is
> reproducible. And the whole thing starts with **one command** — `./run_demo.sh` — which builds
> the Python environment, installs both sides, sets up the database, and launches both servers:
> the **ML API on port 8000** and the **web app on port 3000**. As you can see in the terminal,
> both are running right now with no errors."

---

## ⏱️ PART 3 — The ML Model Notebook (1:15 – 3:05)
### 🎯 Rubric: *ML track — data visualization, data engineering, model architecture, performance metrics*

**SHOW:** Scroll slowly through `nura_health_model.ipynb`, pausing on each chart as you mention it.

### Data visualization (Section 1)
> "Here's the core of the project — the model notebook. The data is the **real Rwanda DHS
> 2019–20 health survey**, about 3,400 children under five. In Section 1, I visualize the data:
> these charts show the **distributions** of weight, height, arm circumference, and age, and this
> one shows the **class balance**. You can see it's very imbalanced — most children are healthy,
> and only a few are severely wasted, which is a challenge for the model."

### Data engineering (Section 2)
> "In Section 2 I do the **data engineering**. I create the labels using the official
> **WHO 2006 weight-for-height z-score** thresholds. Then, because the classes are imbalanced,
> I apply **SMOTE** to oversample the minority classes — this chart shows the balanced dataset
> after SMOTE, which helps the model learn to detect the rare, severe cases."

### Model architecture (Section 3)
> "Section 3 is the **model architecture**. I trained three models: a **Random Forest**,
> an **XGBoost** gradient-boosting classifier, and a **Voting Ensemble** that combines them.
> XGBoost builds 200 decision trees in sequence, each correcting the previous one's errors,
> with a tuned learning rate and tree depth."

### Performance metrics (Section 4)
> "Section 4 is the **performance metrics**. Here's the comparison — **XGBoost is the best,
> at 93.02 percent accuracy**, with **82 percent recall on severely-wasted children**. The
> **93.02 percent figure is accuracy**, which measures overall correctness on the test set.
> I also report **recall** for the severely wasted class because missing a child who needs
> urgent referral is the most serious mistake. These **confusion matrices** and
> **classification reports** show the **precision, recall, and F1-score** for every class."

### Explainability (Section 5)
> "Finally, Section 5 uses **SHAP** to explain the model. It confirms that **MUAC, weight, and
> height** are the most important features — which matches what doctors expect. That's important
> for trust: a health worker can see *why* a child was flagged."

---

## ⏱️ PART 4 — Backend API (Swagger) (3:05 – 3:50)
### 🎯 Rubric: *Backend — server-side code & API endpoints* + *ML deployment as API UI*

**SHOW:** Swagger UI at `http://localhost:8000/docs`. Expand **`POST /predict/child-malnutrition`** → click **Try it out**.

> "That trained model is served by a **FastAPI** backend. This is the **Swagger UI** — an
> auto-generated, interactive API interface. It has a health check and the prediction endpoint.
> Let me run a real prediction. I'll enter a small, underweight child: weight **8.3 kg**,
> height **70.6 cm**, MUAC **10.2 mm**, age **18 months**, and **Execute**."

**SHOW:** Point at the JSON response.

> "Instantly the API returns **severely wasted** at about **97 percent confidence**, plus the
> message in **English and Kinyarwanda**, and an **urgent referral** action. This is the live
> model running — not a fake response."

---

## ⏱️ PART 5 — The Web App: Full User Flow (3:50 – 6:15)
### 🎯 Rubric: *Frontend development* + *Navigation & layout structures* (the biggest block)

**SHOW:** The app at `http://localhost:3000`. Walk through every screen **in order**, slowly.

### Splash & Onboarding
> "Now the actual app a health worker uses — it's mobile-first. It opens on a branded
> **splash screen**, then an **onboarding** screen that explains what it does."

### Register
> "A new health worker can **register** — name, email, password, and their location in Rwanda.
> The form validates the input and rejects duplicate emails."

### Login
**SHOW:** Go to Login (fields are pre-filled with the demo account) and click the button.
> "I'll log in with the demo account. Notice it signs in instantly and lands on the dashboard."

### Home dashboard
> "This is the **home dashboard**. At the top, today's screening count and urgent referrals.
> In the middle, a big **New Screening** button. Below, the recent screenings, each
> **colour-coded** by severity — green, amber, red. And at the bottom is the **navigation bar**:
> **Home, Patients, Screenings, and Profile** — it's consistent on every screen, so the app is
> easy to move around."

### New Screening
**SHOW:** Tap **New Screening** → select a child → fill weight `8.3`, height `70.6`, MUAC `10.2`, age `18`.
> "Let's run a real screening. I tap **New Screening**, choose a child, and enter the
> **five measurements** — weight, height, arm circumference, age, and sex. Each field has its
> unit and validation built in."

### Result
**SHOW:** Tap **Analyse**. Let the Result screen load.
> "I tap **Analyse**, the app sends the data to the ML model, and here's the **result** —
> **Severely Wasted**, about 96 percent confidence, colour-coded red. It shows **what it means**,
> the **recommended action**, and **nutrition advice**, all in **English and Kinyarwanda**.
> And this result is **saved to the database** against that child."

### Patients, Screenings & Profile
**SHOW:** Tap through Patients → Screenings → (open one) → Profile.
> "Under **Patients**, I see all registered children. **Screenings** lists every past screening,
> and I can open one to see its full detail. **Profile** shows the health worker's information and
> location, with a logout button. The app also supports **English and Kinyarwanda**, and a
> **dark mode** — you can see the language and theme toggles at the top."

---

## ⏱️ PART 6 — Database Schema & Deployment (6:15 – 6:55)
### 🎯 Rubric: *Database schema* + *Deployment*

**SHOW:** VS Code → `nurahealth_frontend/prisma/schema.prisma`.

> "Behind the app, the data is modeled with **Prisma**. There are three tables. **User** is the
> health worker. **Child** is each screened child. And **Screening** is each screening event —
> it stores the five measurements, the classification, and the confidence, and links back to the
> child and the health worker who did it. For development I use **SQLite**, and for production I
> only change the connection string to **PostgreSQL** — the rest of the code stays the same."

> "For **deployment**: right now everything runs locally with one command. In production, the
> plan is to host the **FastAPI model on Railway or Render**, the **Next.js app on Vercel**, and
> the **database on Neon Postgres**. That full deployment plan is written in the README."

---

## ⏱️ PART 7 — Closing (6:55 – 7:10)

**SHOW:** Back on the home screen, or the GitHub repo page.

> "So that's **Nura Health** — a working, full-stack machine-learning MVP that turns five simple
> measurements into an instant, explainable malnutrition diagnosis for health workers in Rwanda.
> All the code, the model notebook, the database schema, the designs, and the setup instructions
> are in the GitHub repo linked in the description. Thank you for watching."

---

## 📋 Rubric coverage — make sure you hit all three

| Rubric criterion | Where you cover it in the video |
|---|---|
| **Review requirements & tools** | Part 2 — naming each tool (XGBoost, FastAPI, Next.js, Prisma) and why you chose it. |
| **Development environment setup** | Part 2 — `requirements.txt`, `run_demo.sh`, both servers running with no errors. |
| **Navigation & layout structures** | Part 5 — the full Splash → Onboarding → Login → Home → Screening → Result → Patients/Profile flow + the bottom nav bar; reinforced by the grouped Swagger UI in Part 4. |
| **ML track deliverables** | Part 3 — data viz, SMOTE engineering, model architecture, performance metrics, SHAP. |
| **Deployment option (MVP / API UI)** | Part 4 (Swagger API UI) + Part 5 (live web MVP) + Part 6 (deployment plan). |

---

## ⏱️ Timing cheat-sheet

| Part | Topic | Time | Running total |
|---|---|---|---|
| 1 | Intro | 0:35 | 0:35 |
| 2 | Tools & environment | 0:40 | 1:15 |
| 3 | ML notebook | 1:50 | 3:05 |
| 4 | Swagger API | 0:45 | 3:50 |
| 5 | Web app flow | 2:25 | 6:15 |
| 6 | Database & deployment | 0:40 | 6:55 |
| 7 | Closing | 0:15 | 7:10 |

> If you need to **shorten** to ~5 min: trim Part 3 (mention only data viz, accuracy, and SHAP)
> and speed through Part 5. If you want closer to **10 min**: slow down on each notebook chart and
> demonstrate a **second** screening with a *normal* child to contrast the result.

---

## 🔑 Demo data reminders

- **Demo login:** `demo.chw@nura.rw` / `Demo@12345`
- **Severely-wasted example** (for a dramatic result): weight `8.3`, height `70.6`, MUAC `10.2`, age `18`, sex male
- **Normal example** (optional contrast): weight `14`, height `95`, MUAC `15`, age `48`, sex female
- **Two placeholders to fill before submitting:** your **GitHub repo URL** and this **video link** in the README.
