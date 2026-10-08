import { handle } from "@/lib/analytics/http";
import { getStudentDetail } from "@/lib/analytics/service";

export const dynamic = "force-dynamic";

/** Profile pop-up data for one student. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return handle(req, (filters) => getStudentDetail(id, filters));
}
