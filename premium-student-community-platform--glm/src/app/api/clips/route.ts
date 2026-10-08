import { NextRequest, NextResponse } from "next/server";

// GET /api/clips — List game clips
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const sort = searchParams.get("sort") || "latest"; // latest | popular
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const clips = [
      { id: "1", title: "Insane CODMW Quickscope!", gameId: "1", game: "COD Mobile", likes: 342, views: 1200, user: "Ivan M.", createdAt: new Date().toISOString() },
      { id: "2", title: "FC 25 Last-Minute Winner", gameId: "2", game: "FC Mobile", likes: 287, views: 980, user: "Sarah N.", createdAt: new Date().toISOString() },
      { id: "3", title: "PUBG 1v3 Clutch!", gameId: "3", game: "PUBG Mobile", likes: 198, views: 650, user: "David O.", createdAt: new Date().toISOString() },
      { id: "4", title: "Chess Checkmate in 4 Moves", gameId: "7", game: "Chess", likes: 156, views: 430, user: "Grace A.", createdAt: new Date().toISOString() },
      { id: "5", title: "Clash Royale 3-Crown Rush", gameId: "4", game: "Clash Royale", likes: 134, views: 390, user: "Peter W.", createdAt: new Date().toISOString() },
    ];

    let filtered = gameId ? clips.filter((c) => c.gameId === gameId) : clips;
    if (sort === "popular") {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes);
    }

    return NextResponse.json({ success: true, clips: filtered.slice(0, limit), total: filtered.length });
  } catch (error) {
    console.error("[API /clips GET]", error);
    return NextResponse.json({ error: "Failed to fetch clips." }, { status: 500 });
  }
}

// POST /api/clips — Upload a new clip
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, videoUrl, gameId } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json({ error: "Title is required (min 3 characters)." }, { status: 400 });
    }
    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json({ error: "Video URL is required." }, { status: 400 });
    }

    const clip = {
      id: crypto.randomUUID(),
      title: title.trim(),
      videoUrl,
      gameId: gameId || null,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, clip }, { status: 201 });
  } catch (error) {
    console.error("[API /clips POST]", error);
    return NextResponse.json({ error: "Failed to upload clip." }, { status: 400 });
  }
}
