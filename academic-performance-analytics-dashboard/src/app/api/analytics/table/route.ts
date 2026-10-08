import { handle } from "@/lib/analytics/http";
import { getTable } from "@/lib/analytics/service";

export const dynamic = "force-dynamic";

/** Rows + column definitions for the sortable / filterable table. */
export async function GET(req: Request) {
  return handle(req, (filters) => getTable(filters));
}
