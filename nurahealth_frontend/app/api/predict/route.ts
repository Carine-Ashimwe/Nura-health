import { NextResponse } from "next/server";
import { z } from "zod";

// Proxies the screening to the Python FastAPI ML service (server-side,
// so the model URL stays on the server and there are no CORS issues).
const schema = z.object({
  weight_kg: z.number(),
  height_cm: z.number(),
  muac_mm: z.number(),
  age_months: z.number(),
  sex: z.number(),
});

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ detail: "Invalid measurements." }, { status: 400 });
  }

  try {
    const r = await fetch(`${ML_API_URL}/predict/child-malnutrition`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json(
      { detail: "The ML service is not reachable. Is the FastAPI backend running on port 8000?" },
      { status: 502 },
    );
  }
}
