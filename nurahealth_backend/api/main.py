"""
Nura Health — ML Inference API
Child Malnutrition Screening for Community Health Workers in Rwanda
Run with: uvicorn api.main:app --reload

This service does ML inference only. Authentication, users and screening
records are handled by the Next.js frontend (Prisma + jose).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
MODEL_PATH = os.path.join(PROJECT_DIR, "models", "xgboost.joblib")


app = FastAPI(
    title="Nura Health ML API",
    description="Child malnutrition classification API for Rwanda CHWs. "
                "Classifies children under 5 as normal, wasted, or severely wasted "
                "using 5 anthropometric measurements.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Best model is loaded at startup
model = None


@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✓ Model loaded from {MODEL_PATH}")
    else:
        print(f"⚠ Model not found at {MODEL_PATH}")


class ScreeningInput(BaseModel):
    weight_kg: float = Field(..., example=8.3, description="Child weight in kilograms")
    height_cm: float = Field(..., example=70.6, description="Child height in centimetres")
    muac_mm: float = Field(..., example=10.2, description="Mid-upper arm circumference")
    age_months: int = Field(..., example=18, description="Child age in months (6–59)")
    sex: int = Field(..., example=0, description="Sex: 0=male, 1=female")


class ScreeningResult(BaseModel):
    classification: str
    confidence_pct: float
    message_english: str
    message_kinyarwanda: str
    action: str
    advice_english: str
    advice_kinyarwanda: str


MESSAGES = {
    "normal": {
        "en": "Child's nutritional status is normal.",
        "rw": "Imirire y'umwana iri mu buryo bwiza.",
        "action": "Continue routine growth monitoring. Next visit in 4 weeks.",
        "advice_en": "Keep feeding a balanced diet — vegetables, fruits, beans, eggs, "
                     "milk, and energy foods like sweet potato and rice. Continue "
                     "breastfeeding where appropriate and keep monitoring growth.",
        "advice_rw": "Komeza guha umwana indyo yuzuye — imboga, imbuto, ibishyimbo, "
                     "amagi, amata, n'ibitanga ingufu nk'ibijumba n'umuceri. Komeza "
                     "konsa bibaye ngombwa, ukomeze ukurikirane imikurire.",
    },
    "wasted": {
        "en": "Child shows signs of wasting. Nutritional support recommended.",
        "rw": "Umwana agaragaza ibimenyetso by'imirire mibi. Gufasha imirire birasabwa.",
        "action": "Refer to health centre for supplementary feeding. Follow up in 2 weeks.",
        "advice_en": "Feed energy- and protein-rich foods more often: porridge enriched "
                     "with oil or groundnuts, beans, eggs, avocado, milk, fish, and plenty "
                     "of vegetables. Add a healthy snack between the main meals.",
        "advice_rw": "Ha umwana ibiribwa bitanga ingufu na poroteyine kenshi: igikoma "
                     "kivanze n'amavuta cyangwa ubunyobwa, ibishyimbo, amagi, avoka, amata, "
                     "amafi, n'imboga nyinshi. Wongereho utunyamafunguro hagati y'amafunguro.",
    },
    "severely_wasted": {
        "en": "Child is severely wasted. Urgent referral required.",
        "rw": "Umwana afite ubuzima bubi cyane bw'imirire. Kohereza ku bitaro vuba.",
        "action": "URGENT: Refer immediately to health facility for therapeutic feeding.",
        "advice_en": "Urgent: start therapeutic feeding (RUTF / Plumpy'Nut) under a health "
                     "worker, keep breastfeeding, and give small energy-dense meals often. "
                     "Continue giving vegetables, eggs and milk once the child can eat.",
        "advice_rw": "Byihutirwa: tangira kugaburira umwana ibiribwa bivura (RUTF / "
                     "Plumpy'Nut) ukurikije inama z'umuganga, komeza konsa, umuhe "
                     "utunyamafunguro twinshi dutanga ingufu. Komeza umuhe imboga, amagi "
                     "n'amata igihe ashobora kurya.",
    },
}

CLASS_LABELS = ["normal", "severely_wasted", "wasted"]


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Nura Health ML API is running",
        "version": "1.0.0",
        "model_loaded": model is not None,
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "model_ready": model is not None}


@app.post("/predict/child-malnutrition", response_model=ScreeningResult, tags=["Prediction"])
def predict(data: ScreeningInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run training notebook first.")

    features = np.array([[data.weight_kg, data.height_cm, data.muac_mm, data.age_months, data.sex]])

    prediction_idx = int(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]
    confidence = float(max(probabilities)) * 100

    label = CLASS_LABELS[prediction_idx]
    msg = MESSAGES[label]

    return ScreeningResult(
        classification=label,
        confidence_pct=round(confidence, 1),
        message_english=msg["en"],
        message_kinyarwanda=msg["rw"],
        action=msg["action"],
        advice_english=msg["advice_en"],
        advice_kinyarwanda=msg["advice_rw"],
    )
