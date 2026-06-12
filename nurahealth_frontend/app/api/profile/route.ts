import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

const schema = z.object({
  full_name: z.string().min(2),
  province: z.string().optional(),
  district: z.string().optional(),
  sector: z.string().optional(),
  cell: z.string().optional(),
  village: z.string().optional(),
  reporting_facility: z.string().optional(),
  password: z.string().min(6).optional().or(z.literal("")),
});

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ detail: "Please check your details." }, { status: 400 });
  }
  const { full_name, password } = parsed.data;

  const data: {
    fullName: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    reportingFacility: string;
    passwordHash?: string;
  } = {
    fullName: full_name.trim(),
    province: parsed.data.province?.trim() || "",
    district: parsed.data.district?.trim() || "",
    sector: parsed.data.sector?.trim() || "",
    cell: parsed.data.cell?.trim() || "",
    village: parsed.data.village?.trim() || "",
    reportingFacility: parsed.data.reporting_facility?.trim() || "",
  };
  if (password) data.passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({ where: { id: session.id }, data });

  // Re-issue the session so the new name is reflected immediately.
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
