import { supabase } from "@/lib/supabase";

async function getQueueSnapshot(code: string) {
  const normalizedCode = code.toUpperCase();

  // Get queue
  const { data: queue, error: queueError } = await supabase
    .from("queues")
    .select("*")
    .eq("code", normalizedCode)
    .single();

  if (queueError || !queue) {
    console.error("Queue fetch error:", queueError);
    return null;
  }

  // Get tickets belonging to this queue
  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("queue_code", normalizedCode)
    .order("number", { ascending: true });

  if (ticketsError) {
    console.error("Tickets fetch error:", ticketsError);
    throw new Error(ticketsError.message);
  }

  const formattedTickets = (tickets ?? []).map((ticket) => ({
    id: ticket.id,
    number: ticket.number,
    guestName: ticket.guest_name,
    status: ticket.status,
    joinedAt: ticket.joined_at,
    calledAt: ticket.called_at,
    completedAt: ticket.completed_at,
  }));

  const waiting = formattedTickets.filter(
    (ticket) => ticket.status === "waiting",
  );

  const serving = formattedTickets.filter(
    (ticket) => ticket.status === "serving",
  );

  const nowServing = serving.at(-1) ?? null;

  const servedToday = formattedTickets.filter(
    (ticket) => ticket.status === "done",
  ).length;

  return {
    code: queue.code,
    name: queue.name,
    venue: queue.venue,
    avgMinutes: queue.avg_minutes,
    paused: queue.paused,
    createdAt: queue.created_at,
    tickets: formattedTickets,
    nowServing,
    waiting,
    servedToday,
    estimatedWaitMinutes: waiting.length * queue.avg_minutes,
  };
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]">,
) {
  try {
    const { code } = await ctx.params;

    const queue = await getQueueSnapshot(code);

    if (!queue) {
      return Response.json(
        { error: "Queue not found." },
        { status: 404 },
      );
    }

    return Response.json({ queue });
  } catch (error) {
    console.error("Queue GET error:", error);

    return Response.json(
      { error: "Could not fetch queue." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/queues/[code]">,
) {
  try {
    const { code } = await ctx.params;
    const normalizedCode = code.toUpperCase();

    const body = (await request.json()) as {
      paused?: boolean;
    };

    const { data, error } = await supabase
      .from("queues")
      .update({
        paused: Boolean(body.paused),
      })
      .eq("code", normalizedCode)
      .select()
      .single();

    if (error || !data) {
      console.error("Queue update error:", error);

      return Response.json(
        { error: "Queue not found." },
        { status: 404 },
      );
    }

    const queue = await getQueueSnapshot(normalizedCode);

    if (!queue) {
      return Response.json(
        { error: "Queue not found." },
        { status: 404 },
      );
    }

    return Response.json({ queue });
  } catch (error) {
    console.error("Queue PATCH error:", error);

    return Response.json(
      { error: "Could not update queue." },
      { status: 500 },
    );
  }
}

// DELETE — Close a queue and remove its tickets
export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]">,
) {
  try {
    const { code } = await ctx.params;
    const normalizedCode = code.toUpperCase();

    // Delete all tickets belonging to this queue first
    const { error: ticketsError } = await supabase
      .from("tickets")
      .delete()
      .eq("queue_code", normalizedCode);

    if (ticketsError) {
      console.error("Ticket deletion error:", ticketsError);

      return Response.json(
        { error: "Could not delete queue tickets." },
        { status: 500 },
      );
    }

    // Delete the queue itself
    const { error: queueError } = await supabase
      .from("queues")
      .delete()
      .eq("code", normalizedCode);

    if (queueError) {
      console.error("Queue deletion error:", queueError);

      return Response.json(
        { error: "Could not delete queue." },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      message: "Queue closed successfully.",
    });
  } catch (error) {
    console.error("Queue DELETE error:", error);

    return Response.json(
      { error: "Could not delete queue." },
      { status: 500 },
    );
  }
}