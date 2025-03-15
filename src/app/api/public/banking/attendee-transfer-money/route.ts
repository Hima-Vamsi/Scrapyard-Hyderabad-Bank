import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import mysql from "mysql2/promise";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { receiver_email, amount } = await request.json();

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      email: string;
      name: string;
    };
    const sender_email = decoded.email;
    const sender_name = decoded.name;

    if (sender_email === receiver_email) {
      return NextResponse.json(
        { error: "Sender cannot also be the receiver" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const senderRecord = await usersCollection.findOne({ email: sender_email });
    if (!senderRecord || senderRecord.money < amount) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    const receiverRecord = await usersCollection.findOne({
      email: receiver_email,
    });
    if (!receiverRecord) {
      return NextResponse.json({ error: "Invalid receiver" }, { status: 400 });
    }
    const receiver_name = receiverRecord.name;

    const newSenderBalance = senderRecord.money - amount;
    await usersCollection.updateOne(
      { email: sender_email },
      { $set: { money: newSenderBalance } }
    );

    const newReceiverBalance = receiverRecord.money + amount;
    await usersCollection.updateOne(
      { email: receiver_email },
      { $set: { money: newReceiverBalance } }
    );

    const generateTransactionId = () => Math.random().toString().slice(2, 18);
    const senderTransactionId = generateTransactionId();
    const receiverTransactionId = generateTransactionId();

    const istDate = toZonedTime(new Date(), "Asia/Kolkata");
    const date = format(istDate, "yyyy-MM-dd");
    const time = format(istDate, "HH:mm:ss");

    const mysqlConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT!),
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    await mysqlConnection.execute(
      "INSERT INTO transactions (transactionId, owner_email, amount, description, date, time) VALUES (?, ?, ?, ?, ?, ?)",
      [
        senderTransactionId,
        sender_email,
        -amount,
        `Money transfer to ${receiver_name}`,
        date,
        time,
      ]
    );

    await mysqlConnection.execute(
      "INSERT INTO transactions (transactionId, owner_email, amount, description, date, time) VALUES (?, ?, ?, ?, ?, ?)",
      [
        receiverTransactionId,
        receiver_email,
        amount,
        `Money transfer from ${sender_name}`,
        date,
        time,
      ]
    );

    await mysqlConnection.end();

    return NextResponse.json({
      message: "Transfer successful",
      transactionId: senderTransactionId,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
