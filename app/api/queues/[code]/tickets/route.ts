import { joinQueue } from "@/lib/store";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/queues/[code]/tickets">,
) {
  const { code } = await ctx.params;
  const body = (await request.json()) as { guestName?: string };
  const result = joinQueue(code, body.guestName ?? "");

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json(result, { status: 201 });
}
