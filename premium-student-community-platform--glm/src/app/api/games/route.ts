import { NextRequest, NextResponse } from "next/server";

// GET /api/games — List games with optional type filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // online | offline
    const category = searchParams.get("category"); // fps | sports | strategy | puzzle | racing | adventure

    const allGames = [
      { id: "1", title: "Call of Duty: Mobile", category: "fps", type: "online", rating: 4.8, playersCount: 120, isActive: true },
      { id: "2", title: "FIFA / FC Mobile", category: "sports", type: "online", rating: 4.7, playersCount: 95, isActive: true },
      { id: "3", title: "PUBG Mobile", category: "fps", type: "online", rating: 4.6, playersCount: 80, isActive: true },
      { id: "4", title: "Clash Royale", category: "strategy", type: "online", rating: 4.5, playersCount: 60, isActive: true },
      { id: "5", title: "Free Fire", category: "fps", type: "online", rating: 4.3, playersCount: 55, isActive: true },
      { id: "6", title: "Among Us", category: "strategy", type: "online", rating: 4.4, playersCount: 40, isActive: true },
      { id: "7", title: "Chess", category: "strategy", type: "offline", rating: 4.9, playersCount: 200, isActive: true },
      { id: "8", title: "Ludo", category: "strategy", type: "offline", rating: 4.5, playersCount: 180, isActive: true },
      { id: "9", title: "Sudoku", category: "puzzle", type: "offline", rating: 4.6, playersCount: 150, isActive: true },
      { id: "10", title: "Snake & Ladder", category: "strategy", type: "offline", rating: 4.2, playersCount: 130, isActive: true },
      { id: "11", title: "Scrabble", category: "puzzle", type: "offline", rating: 4.7, playersCount: 90, isActive: true },
      { id: "12", title: "Checkers", category: "strategy", type: "offline", rating: 4.3, playersCount: 75, isActive: true },
    ];

    let filtered = allGames;
    if (type) filtered = filtered.filter((g) => g.type === type);
    if (category) filtered = filtered.filter((g) => g.category === category);

    return NextResponse.json({ success: true, games: filtered, total: filtered.length });
  } catch (error) {
    console.error("[API /games GET]", error);
    return NextResponse.json({ error: "Failed to fetch games." }, { status: 500 });
  }
}
