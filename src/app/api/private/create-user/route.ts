import { connectToDatabase } from "@/lib/mongodb";
import { createMysqlConnection } from "@/lib/mysql";
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

  let mysqlConnection;
  try {
    mysqlConnection = await createMysqlConnection();
    const [rows]: any = await mysqlConnection.execute(
      `SELECT account FROM ${process.env.MYSQL_ATTENDEES_TABLE} WHERE attendee_email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Attendee not found" },
        { status: 404 }
      );
    }

    const attendee = rows[0];
    if (attendee.account === 1) {
      return NextResponse.json(
        { error: "User already exists" },
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
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      money: 100,
      jwtToken: "",
    };

    await db.collection("users").insertOne(newUser);

    await mysqlConnection.execute(
      `UPDATE ${process.env.MYSQL_ATTENDEES_TABLE} SET account = 1 WHERE attendee_email = ?`,
      [email]
    );

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}
