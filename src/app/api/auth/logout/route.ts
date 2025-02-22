import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function POST() {
  const token = await cookies().then((cookies) => cookies.get("token"));
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  let email;

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token?.value, process.env.JWT_SECRET);
    email = (decoded as jwt.JwtPayload).email;
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    const usersCollection = db.collection("users");
    await usersCollection.updateOne({ email }, { $set: { jwtToken: "" } });

    const response = NextResponse.json(
      { message: "Logged out" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Database update failed", error },
      { status: 500 }
    );
  }
}
