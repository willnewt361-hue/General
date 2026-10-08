/** Tiny helper shared by every analytics route: bootstrap DB, parse filters, handle errors. */
import { NextResponse } from "next/server";
import { ensureAnalyticsReady } from "./bootstrap";
import { applyRoleScope, parseFilters, type Filters } from "./filters";

export async function handle<T>(req: Request, work: (filters: Filters) => Promise<T>) {
  try {
    await ensureAnalyticsReady();
    const filters = await applyRoleScope(parseFilters(new URL(req.url).searchParams));
    const data = await work(filters);
    if (data === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[analytics]", err);
    return NextResponse.json({ error: "Analytics query failed" }, { status: 500 });
  }
}
