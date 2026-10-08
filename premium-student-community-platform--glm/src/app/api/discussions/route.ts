import { NextRequest, NextResponse } from "next/server";

// POST /api/discussions — Create a new discussion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, section, category } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 5) {
      return NextResponse.json({ error: "Content must be at least 5 characters." }, { status: 400 });
    }

    const validSections = ["general", "council", "prefect"];
    const validCategories = ["general", "academics", "events", "welfare", "discipline"];

    const discussion = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      section: validSections.includes(section) ? section : "general",
      category: validCategories.includes(category) ? category : "general",
      replyCount: 0,
      viewCount: 0,
      isPinned: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, discussion }, { status: 201 });
  } catch (error) {
    console.error("[API /discussions POST]", error);
    return NextResponse.json({ error: "Failed to create discussion." }, { status: 400 });
  }
}

// GET /api/discussions — List discussions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const discussions = [
      { id: "1", title: "Should we have a school talent show?", section: "general", category: "events", replyCount: 34, viewCount: 156, createdAt: new Date().toISOString() },
      { id: "2", title: "Proposed changes to the dress code", section: "council", category: "welfare", replyCount: 56, viewCount: 230, createdAt: new Date().toISOString() },
      { id: "3", title: "Library hours extension request", section: "prefect", category: "academics", replyCount: 23, viewCount: 89, createdAt: new Date().toISOString() },
    ];

    const filtered = section ? discussions.filter((d) => d.section === section) : discussions;

    return NextResponse.json({ success: true, discussions: filtered, total: filtered.length, limit });
  } catch (error) {
    console.error("[API /discussions GET]", error);
    return NextResponse.json({ error: "Failed to fetch discussions." }, { status: 500 });
  }
}
