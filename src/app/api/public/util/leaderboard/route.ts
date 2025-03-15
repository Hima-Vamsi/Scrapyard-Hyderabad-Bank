import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get("userEmail");
        if (!userEmail) {
            return NextResponse.json({ error: "userEmail is required" }, { status: 400 });
        }

        const db = await connectToDatabase();
        if (!db) {
            throw new Error("Failed to connect to the database");
        }
        const usersCollection = db.collection("users");

        const topUsers = await usersCollection
            .find({})
            .sort({ money: -1 })
            .limit(10)
            .project({ name: 1, email: 1, money: 1 })
            .toArray();

        const user = await usersCollection.findOne({ email: userEmail }, { projection: { name: 1, email: 1, money: 1 } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userRank = await usersCollection.countDocuments({ money: { $gt: user.money } }) + 1;

        const formattedData = topUsers.map((user, index) => ({
            id: index + 1,
            rank: index + 1,
            name: user.name,
            money: user.money,
            color: "rgba(255, 255, 255, 0)",
            show: false
        }));

        formattedData.push({
            id: 11,
            rank: userRank,
            name: user.name,
            money: user.money,
            color: "rgba(255, 255, 255, 0)",
            show: false
        });
        return NextResponse.json(formattedData, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}
