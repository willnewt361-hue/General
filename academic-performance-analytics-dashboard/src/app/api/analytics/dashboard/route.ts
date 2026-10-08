import { handle } from "@/lib/analytics/http";
import { getDashboard } from "@/lib/analytics/service";

export const dynamic = "force-dynamic";

/** KPIs, chart series, insights - everything except the table. */
export async function GET(req: Request) {
  return handle(req, (filters) => getDashboard(filters));
}
