import { NextRequest, NextResponse } from "next/server";

// GET /api/leaderboard — Get leaderboard data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

    const leaderboard = [
      { rank: 1, userId: "u1", name: "Ivan Mukasa", school: "Gayaza HS", game: "COD Mobile", score: 12450, wins: 87, losses: 12 },
      { rank: 2, userId: "u2", name: "Sarah Nakamya", school: "Nabisunsa", game: "FC Mobile", score: 11200, wins: 72, losses: 18 },
      { rank: 3, userId: "u3", name: "David Ochieng", school: "SMACK", game: "PUBG Mobile", score: 10800, wins: 65, losses: 20 },
      { rank: 4, userId: "u4", name: "Grace Atim", school: "Maryhill", game: "Chess", score: 9900, wins: 58, losses: 5 },
      { rank: 5, userId: "u5", name: "Peter Wasswa", school: "St. Kisubi", game: "Clash Royale", score: 9450, wins: 61, losses: 22 },
      { rank: 6, userId: "u6", name: "Amina Nalubega", school: "Gayaza HS", game: "Ludo", score: 8700, wins: 48, losses: 15 },
      { rank: 7, userId: "u7", name: "Joshua Mutyaba", school: "SMACK", game: "Sudoku", score: 8200, wins: 42, losses: 8 },
      { rank: 8, userId: "u8", name: "Patricia Aine", school: "Nabisunsa", game: "COD Mobile", score: 7900, wins: 55, losses: 30 },
      { rank: 9, userId: "u9", name: "Emmanuel Ssekiziyi", school: "Maryhill", game: "FC Mobile", score: 7500, wins: 40, losses: 25 },
      { rank: 10, userId: "u10", name: "Hannah Nabwire", school: "Gayaza HS", game: "PUBG Mobile", score: 7100, wins: 38, losses: 28 },
    ];

    const filtered = gameId ? leaderboard.filter((e) => e.game === gameId) : leaderboard;

    return NextResponse.json({ success: true, leaderboard: filtered.slice(0, limit), total: filtered.length });
  } catch (error) {
    console.error("[API /leaderboard GET]", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard." }, { status: 500 });
  }
}
