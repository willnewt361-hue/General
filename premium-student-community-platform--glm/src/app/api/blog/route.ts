import { NextRequest, NextResponse } from "next/server";

// POST /api/blog — Create a new blog post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, tags, excerpt } = body;

    // Validate required fields
    if (!title || typeof title !== "string" || title.trim().length < 5) {
      return NextResponse.json(
        { error: "Title is required and must be at least 5 characters." },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Content is required and must be at least 10 characters." },
        { status: 400 }
      );
    }

    // In production, this would insert into the database via Drizzle
    const post = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt || content.slice(0, 150),
      category: category || "general",
      tags: Array.isArray(tags) ? tags : [],
      likes: 0,
      views: 0,
      commentCount: 0,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("[API /blog POST]", error);
    return NextResponse.json(
      { error: "Failed to create post. Invalid request body." },
      { status: 400 }
    );
  }
}

// GET /api/blog — List blog posts (with optional filters)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "latest";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // In production, this would query the database via Drizzle
    // Mock response for now
    const posts = [
      {
        id: "1",
        title: "Why Chess Should Be a UNEB Subject",
        excerpt: "As a chess enthusiast, I believe strategic thinking should be part of our curriculum...",
        category: "opinion",
        tags: ["UNEB", "Chess"],
        likes: 87,
        views: 340,
        commentCount: 23,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "2",
        title: "My First Hackathon Experience",
        excerpt: "Last weekend, our school participated in the National Hackathon...",
        category: "tech",
        tags: ["Tech", "Cambridge"],
        likes: 134,
        views: 560,
        commentCount: 45,
        createdAt: new Date(Date.now() - 18000000).toISOString(),
      },
    ];

    let filtered = posts;
    if (category) {
      filtered = posts.filter((p) => p.category === category);
    }

    return NextResponse.json({
      success: true,
      posts: filtered,
      total: filtered.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[API /blog GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}
