import { NextRequest, NextResponse } from "next/server";

// POST /api/announcements — Create announcement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, section, priority } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json({ error: "Title is required (min 3 characters)." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 5) {
      return NextResponse.json({ error: "Content is required (min 5 characters)." }, { status: 400 });
    }

    const validSections = ["general", "council", "prefect"];
    const validPriorities = ["urgent", "high", "normal", "low"];

    const announcement = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      section: validSections.includes(section) ? section : "general",
      priority: validPriorities.includes(priority) ? priority : "normal",
      isPinned: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, announcement }, { status: 201 });
  } catch (error) {
    console.error("[API /announcements POST]", error);
    return NextResponse.json({ error: "Failed to create announcement." }, { status: 400 });
  }
}

// GET /api/announcements — List announcements
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const announcements = [
      { id: "1", title: "End of Term Exams Schedule Released", section: "general", priority: "urgent", isPinned: true, createdAt: new Date().toISOString() },
      { id: "2", title: "Inter-School Sports Day — Register Now!", section: "general", priority: "high", isPinned: true, createdAt: new Date().toISOString() },
      { id: "3", title: "Council Meeting: Budget Review", section: "council", priority: "normal", isPinned: false, createdAt: new Date().toISOString() },
      { id: "4", title: "Prefect Duty Roster for Week 12", section: "prefect", priority: "normal", isPinned: false, createdAt: new Date().toISOString() },
    ];

    const filtered = section ? announcements.filter((a) => a.section === section) : announcements;

    return NextResponse.json({ success: true, announcements: filtered, total: filtered.length, limit });
  } catch (error) {
    console.error("[API /announcements GET]", error);
    return NextResponse.json({ error: "Failed to fetch announcements." }, { status: 500 });
  }
}
