import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

const schema = z.object({
  name: z.string().min(1),
  sex: z.coerce.number().int().min(0).max(1),
  ageMonths: z.coerce.number().int().min(0).max(59),
  caregiver: z.string().optional(),
  village: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  const children = await prisma.child.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ children });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ detail: "Please check the child's details." }, { status: 400 });
  }
  const child = await prisma.child.create({
    data: {
      name: parsed.data.name.trim(),
      sex: parsed.data.sex,
      ageMonths: parsed.data.ageMonths,
      caregiver: parsed.data.caregiver?.trim() || null,
      village: parsed.data.village?.trim() || null,
      userId: session.id,
    },
  });
  return NextResponse.json({ child });
}
