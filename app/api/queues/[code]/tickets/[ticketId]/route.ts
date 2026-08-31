import { getTicket, updateTicket } from "@/lib/store";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]/tickets/[ticketId]">,
) {
  const { code, ticketId } = await ctx.params;
  const result = getTicket(code, ticketId);
  if (!result) {
    return Response.json({ error: "Ticket not found." }, { status: 404 });
  }
  return Response.json(result);
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/queues/[code]/tickets/[ticketId]">,
) {
  const { code, ticketId } = await ctx.params;
  const body = (await request.json()) as {
    action?: "complete" | "skip" | "recall";
  };

  if (
    body.action !== "complete" &&
    body.action !== "skip" &&
    body.action !== "recall"
  ) {
    return Response.json({ error: "Unknown action." }, { status: 400 });
  }

  const result = updateTicket(code, ticketId, body.action);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json({ queue: result });
}
