import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  if (!cookies.session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userSession = JSON.parse(decodeURIComponent(cookies.session));
    return NextResponse.json(userSession, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
