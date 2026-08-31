import { getSnapshot, setPaused } from "@/lib/store";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]">,
) {
  const { code } = await ctx.params;
  const queue = getSnapshot(code);
  if (!queue) {
    return Response.json({ error: "Queue not found." }, { status: 404 });
  }
  return Response.json({ queue });
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/queues/[code]">,
) {
  const { code } = await ctx.params;
  const body = (await request.json()) as { paused?: boolean };
  const queue = setPaused(code, Boolean(body.paused));
  if (!queue) {
    return Response.json({ error: "Queue not found." }, { status: 404 });
  }
  return Response.json({ queue });
}
