import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

const schema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  province: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
  cell: z.string().optional(),
  village: z.string().optional(),
  reporting_facility: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ detail: "Please check your details and try again." }, { status: 400 });
  }
  const { full_name, email, password } = parsed.data;
  const normalisedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalisedEmail } });
  if (existing) {
    return NextResponse.json({ detail: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      fullName: full_name.trim(),
      email: normalisedEmail,
      province: parsed.data.province?.trim() || "",
      district: parsed.data.district?.trim() || "",
      sector: parsed.data.sector?.trim() || "",
      cell: parsed.data.cell?.trim() || "",
      village: parsed.data.village?.trim() || "",
      reportingFacility: parsed.data.reporting_facility?.trim() || "",
      passwordHash,
    },
  });

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
  });

  const res = NextResponse.json({
    user: { id: user.id, full_name: user.fullName, email: user.email },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
