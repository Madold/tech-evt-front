import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/"];
  const privateRoutes = ["/dashboard"];
  const token = req.cookies.get("token")?.value || "";
  const isValidToken = await validateToken(token);

  if (publicRoutes.includes(pathname) && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (privateRoutes.includes(pathname) && !isValidToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// middleware.ts

async function validateToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}
