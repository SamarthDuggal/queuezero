import { supabase } from "@/lib/supabase";

async function getQueueSnapshot(code: string) {
  const normalizedCode = code.toUpperCase();

  const { data: queue, error: queueError } = await supabase
    .from("queues")
    .select("*")
    .eq("code", normalizedCode)
    .single();

  if (queueError || !queue) {
    return null;
  }

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("queue_code", normalizedCode)
    .order("number", { ascending: true });

  if (ticketsError) {
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

  const nowServing =
    formattedTickets.find((ticket) => ticket.status === "serving") ?? null;

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
    servedToday: formattedTickets.filter(
      (ticket) => ticket.status === "done",
    ).length,
    estimatedWaitMinutes: waiting.length * queue.avg_minutes,
  };
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]/tickets/[ticketId]">,
) {
  try {
    const { code, ticketId } = await ctx.params;
    const normalizedCode = code.toUpperCase();

    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .eq("queue_code", normalizedCode)
      .single();

    if (error || !ticket) {
      return Response.json(
        { error: "Ticket not found." },
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

    return Response.json({
      queue,
      ticket: {
        id: ticket.id,
        number: ticket.number,
        guestName: ticket.guest_name,
        status: ticket.status,
        joinedAt: ticket.joined_at,
        calledAt: ticket.called_at,
        completedAt: ticket.completed_at,
      },
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return Response.json(
      { error: "Could not load ticket." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/queues/[code]/tickets/[ticketId]">,
) {
  try {
    const { code, ticketId } = await ctx.params;
    const normalizedCode = code.toUpperCase();

    const body = (await request.json()) as {
      action?: "complete" | "skip" | "recall";
    };

    if (
      body.action !== "complete" &&
      body.action !== "skip" &&
      body.action !== "recall"
    ) {
      return Response.json(
        { error: "Unknown action." },
        { status: 400 },
      );
    }

    let updates: Record<string, unknown>;

    if (body.action === "complete") {
      updates = {
        status: "done",
        completed_at: new Date().toISOString(),
      };
    } else if (body.action === "skip") {
      updates = {
        status: "skipped",
      };
    } else {
      updates = {
        status: "waiting",
        called_at: null,
      };
    }

    const { data: ticket, error: updateError } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", ticketId)
      .eq("queue_code", normalizedCode)
      .select()
      .single();

    if (updateError || !ticket) {
      console.error("Ticket update error:", updateError);

      return Response.json(
        {
          error: updateError?.message || "Ticket not found.",
        },
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
    console.error("Update ticket error:", error);

    return Response.json(
      { error: "Could not update ticket." },
      { status: 500 },
    );
  }
}