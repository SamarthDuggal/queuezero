import { callNext } from "@/lib/store";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]/call">,
) {
  const { code } = await ctx.params;
  const result = callNext(code);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ queue: result });
}
