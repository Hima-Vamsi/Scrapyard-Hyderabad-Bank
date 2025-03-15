import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mysql from "mysql2/promise";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function POST(request: NextRequest) {
    try {
        const { receiverEmail, amount, reason, organizerName } = await request.json();

        const db = await connectToDatabase();
        const usersCollection = db.collection("users");
        console.log(receiverEmail);
        const receiverRecord = await usersCollection.findOne({ email: receiverEmail });
        if (!receiverRecord) {
            return NextResponse.json({ error: "Invalid receiver" }, { status: 400 });
        }

        const newReceiverBalance = receiverRecord.money + amount;
        await usersCollection.updateOne(
            { email: receiverEmail },
            { $set: { money: newReceiverBalance } }
        );

        const generateTransactionId = () => Math.random().toString().slice(2, 18);
        const transactionId = generateTransactionId();

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
                transactionId,
                receiverEmail,
                amount,
                `${reason} Awarded by ${organizerName}`,
                date,
                time,
            ]
        );

        await mysqlConnection.end();

        return NextResponse.json({
            message: "Points awarded successfully",
            transactionId: transactionId,
        });
    } catch (error) {
        console.error("Award points error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
