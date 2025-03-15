import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const SECRET_KEY = process.env.JWT_SECRET;
  if (!SECRET_KEY) {
    return NextResponse.json(
      { error: "JWT secret key is missing" },
      { status: 500 }
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  if (!cookies.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userSession = jwt.verify(cookies.token, SECRET_KEY) as jwt.JwtPayload;
    if (!userSession || !userSession.email) {
      throw new Error("Invalid token payload");
    }

    const name = userSession.name;

    return NextResponse.json({ name }, { status: 200 });
  } catch {
    const response = NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
    return response;
  }
}
