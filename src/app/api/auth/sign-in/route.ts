import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  if (!cookies.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const SECRET_KEY = process.env.JWT_SECRET;

  if (!SECRET_KEY) {
    return NextResponse.json(
      { error: "JWT secret key is missing" },
      { status: 500 }
    );
  }

  try {
    const userSession = jwt.verify(cookies.token, SECRET_KEY);
    return NextResponse.json(userSession, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const SECRET_KEY = process.env.JWT_SECRET;
  if (!SECRET_KEY) {
    return NextResponse.json(
      { error: "JWT secret key is missing" },
      { status: 500 }
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

  // Generate JWT token
  const token = jwt.sign(
    { email: existingUser.email, role: existingUser.role },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  // Hash the JWT token
  const hashedToken = await bcrypt.hash(token, 10);

  // Update the user's jwtToken in the database
  await db
    .collection("users")
    .updateOne(
      { email: existingUser.email },
      { $set: { jwtToken: hashedToken } }
    );

  // Set cookie
  const cookie = serialize("token", token, {
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
