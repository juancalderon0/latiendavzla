import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const rows = await query<{ email: string; password_hash: string }>(
    `SELECT email, password_hash FROM admin_users WHERE email = $1`,
    [email]
  );
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = await createSessionToken(user.email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
