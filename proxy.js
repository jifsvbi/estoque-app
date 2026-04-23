import { NextResponse } from "next/server";

export function proxy(req) {
  const logado = req.cookies.get("auth");

  if (!logado && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};