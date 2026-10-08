import { NextRequest, NextResponse } from "next/server";

// GET /api/tournaments — List tournaments
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // upcoming | live | completed
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const tournaments = [
      { id: "1", title: "COD Mobile Showdown", gameId: "1", game: "COD Mobile", status: "live", maxPlayers: 32, currentPlayers: 28, prize: "USh 50,000", startDate: "2025-12-15" },
      { id: "2", title: "FC 25 Inter-School Cup", gameId: "2", game: "FC Mobile", status: "upcoming", maxPlayers: 16, currentPlayers: 12, prize: "USh 100,000", startDate: "2025-12-20" },
      { id: "3", title: "Chess Championship", gameId: "7", game: "Chess", status: "upcoming", maxPlayers: 16, currentPlayers: 8, prize: "USh 30,000", startDate: "2026-01-05" },
      { id: "4", title: "PUBG Solo Showdown", gameId: "3", game: "PUBG Mobile", status: "completed", maxPlayers: 32, currentPlayers: 32, prize: "USh 50,000", startDate: "2025-12-01" },
      { id: "5", title: "Ludo King Tournament", gameId: "8", game: "Ludo", status: "upcoming", maxPlayers: 64, currentPlayers: 20, prize: "USh 20,000", startDate: "2026-01-10" },
      { id: "6", title: "Clash Royale League", gameId: "4", game: "Clash Royale", status: "completed", maxPlayers: 16, currentPlayers: 16, prize: "USh 40,000", startDate: "2025-11-25" },
    ];

    const validStatuses = ["upcoming", "live", "completed"];
    const filtered = status && validStatuses.includes(status) ? tournaments.filter((t) => t.status === status) : tournaments;

    return NextResponse.json({ success: true, tournaments: filtered.slice(0, limit), total: filtered.length });
  } catch (error) {
    console.error("[API /tournaments GET]", error);
    return NextResponse.json({ error: "Failed to fetch tournaments." }, { status: 500 });
  }
}

// POST /api/tournaments — Create tournament
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, gameId, maxPlayers, prize, startDate } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json({ error: "Title is required (min 3 characters)." }, { status: 400 });
    }

    const tournament = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description || "",
      gameId: gameId || null,
      status: "upcoming",
      maxPlayers: Math.max(2, parseInt(maxPlayers) || 16),
      currentPlayers: 0,
      prize: prize || "",
      startDate: startDate || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, tournament }, { status: 201 });
  } catch (error) {
    console.error("[API /tournaments POST]", error);
    return NextResponse.json({ error: "Failed to create tournament." }, { status: 400 });
  }
}
