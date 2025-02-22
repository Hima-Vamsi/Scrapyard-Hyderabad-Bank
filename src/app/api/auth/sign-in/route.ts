import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const db = await connectToDatabase();
  if (!db) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  const existingUser = await db.collection("users").findOne({ email });

  if (!existingUser) {
    return NextResponse.json({ error: "User does not exist" }, { status: 400 });
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Password is incorrect" },
      { status: 400 }
    );
  }

  // Set session cookie
  const sessionToken = JSON.stringify({
    email: existingUser.email,
    role: existingUser.role,
  });
  const cookie = serialize("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });

  const response = NextResponse.json(
    { role: existingUser.role },
    { status: 200 }
  );
  response.headers.append("Set-Cookie", cookie);
  return response;
}
