import { createMysqlConnection } from "@/lib/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  let connection;
  try {
    connection = await createMysqlConnection();
    const [rows] = await connection.execute(
      `SELECT attendee_name, attendee_email, account FROM ${process.env.MYSQL_ATTENDEES_TABLE}`
    );
    const attendees = (
      rows as {
        attendee_name: string;
        attendee_email: string;
        account: number;
      }[]
    )
      .map((row) => ({
        name: row.attendee_name,
        email: row.attendee_email,
        account: row.account,
      }));
    return NextResponse.json(attendees, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve attendees" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
