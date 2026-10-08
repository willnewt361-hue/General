import { handle } from "@/lib/analytics/http";
import { getMeta } from "@/lib/analytics/service";

export const dynamic = "force-dynamic";

/** Dropdown options: classes, streams, subjects, teachers, students, data range. */
export async function GET(req: Request) {
  return handle(req, () => getMeta());
}
