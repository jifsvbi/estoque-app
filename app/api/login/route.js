import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, senha } = await req.json();

  const [user] = await db.query(
    "SELECT * FROM usuarios WHERE email=? AND senha=?",
    [email, senha]
  );

  if (user.length === 0) {
    return NextResponse.json({ erro: "Login inválido" });
  }

  const res = NextResponse.json({ sucesso: true });
  res.cookies.set("auth", "true");

  return res;
}