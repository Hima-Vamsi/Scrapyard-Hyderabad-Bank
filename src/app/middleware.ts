import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT_SECRET is not set" },
      { status: 500 }
    );
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const pathname = request.nextUrl.pathname;

    if (user.role === "attendee" && pathname.startsWith("/organizer")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    } else if (user.role === "organizer" && pathname.startsWith("/attendee")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/attendee/:path*", "/organizer/:path*"],
};
