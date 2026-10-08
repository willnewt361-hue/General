import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  let dbStatus = "disconnected";
  try {
    await db.execute(sql`select 1`);
    dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: "1.0.0",
    endpoints: {
      blog: "/api/blog",
      discussions: "/api/discussions",
      announcements: "/api/announcements",
      games: "/api/games",
      leaderboard: "/api/leaderboard",
      clips: "/api/clips",
      tournaments: "/api/tournaments",
    },
    sections: {
      gaming: "/gaming",
      blog: "/blog",
      leaders: "/leaders",
    },
  });
}
