import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request: NextRequest) {
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

    const db = await connectToDatabase();
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: userSession.email });
    if (!user || !user.jwtToken) {
      throw new Error("User not found or token missing");
    }

    const tokenMatch = await bcrypt.compare(cookies.token, user.jwtToken);
    if (!tokenMatch) {
      const response = NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
      response.headers.set("Set-Cookie", "token=; Max-Age=0; Path=/; HttpOnly");
      return response;
    }

    return NextResponse.json(userSession, { status: 200 });
  } catch {
    const response = NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
    response.headers.set("Set-Cookie", "token=; Max-Age=0; Path=/; HttpOnly");
    return response;
  }
}
