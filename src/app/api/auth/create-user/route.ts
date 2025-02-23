import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const { name, email, password, role } = await request.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const db = await connectToDatabase();
  if (!db) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = {
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
    money: 0,
    jwtToken: "",
  };

  await db.collection("users").insertOne(newUser);

  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 }
  );
}
