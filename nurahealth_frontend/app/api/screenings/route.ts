import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  childId: z.string().min(1),
  weight_kg: z.number(),
  height_cm: z.number(),
  muac_mm: z.number(),
  age_months: z.number(),
  sex: z.number(),
  classification: z.string(),
  confidence_pct: z.number(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const screenings = await prisma.screening.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { child: true },
  });
  return NextResponse.json({ screenings });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ detail: "Invalid screening data." }, { status: 400 });
  }
  const d = parsed.data;
  const screening = await prisma.screening.create({
    data: {
      childId: d.childId,
      weightKg: d.weight_kg,
      heightCm: d.height_cm,
      muacMm: d.muac_mm,
      ageMonths: d.age_months,
      sex: d.sex,
      classification: d.classification,
      confidence: d.confidence_pct,
      userId: session.id,
    },
  });
  return NextResponse.json({ screening });
}
