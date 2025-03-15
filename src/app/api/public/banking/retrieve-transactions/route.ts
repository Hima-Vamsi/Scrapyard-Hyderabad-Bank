import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { createMysqlConnection } from "@/lib/mysql";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      email: string;
      name: string;
    };
    const user_email = decoded.email;

    const mysqlConnection = await createMysqlConnection();

    const [rows] = await mysqlConnection.execute(
      `SELECT * FROM ${process.env.MYSQL_TRANSACTIONS_TABLE} WHERE owner_email = ? ORDER BY date DESC, time DESC`,
      [user_email]
    );

    await mysqlConnection.end();

    return NextResponse.json({
      message: "Transactions retrieved successfully",
      transactions: rows,
    });
  } catch (error) {
    console.error("Retrieval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
