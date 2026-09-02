import { supabase } from "@/lib/supabase";

async function getQueueSnapshot(code: string) {
  const normalizedCode = code.toUpperCase();

  const { data: queue, error: queueError } = await supabase
    .from("queues")
    .select("*")
    .eq("code", normalizedCode)
    .single();

  if (queueError || !queue) return null;

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("queue_code", normalizedCode)
    .order("number", { ascending: true });

  if (ticketsError) throw new Error(ticketsError.message);

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
    formattedTickets.filter((ticket) => ticket.status === "serving").at(-1) ??
    null;

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

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/queues/[code]/tickets">,
) {
  try {
    const { code } = await ctx.params;
    const normalizedCode = code.toUpperCase();

    const body = (await request.json()) as {
      guestName?: string;
    };

    const guestName = body.guestName?.trim() ?? "";

    if (guestName.length < 2) {
      return Response.json(
        { error: "Please enter a name with at least 2 characters." },
        { status: 400 },
      );
    }

    // Check that the queue exists
    const { data: queue, error: queueError } = await supabase
      .from("queues")
      .select("*")
      .eq("code", normalizedCode)
      .single();

    if (queueError || !queue) {
      return Response.json(
        { error: "Queue not found." },
        { status: 404 },
      );
    }

    if (queue.paused) {
      return Response.json(
        { error: "This line is currently paused." },
        { status: 409 },
      );
    }

    // Find the next ticket number
    const { data: lastTicket, error: lastTicketError } = await supabase
      .from("tickets")
      .select("number")
      .eq("queue_code", normalizedCode)
      .order("number", { ascending: false })
      .limit(1);

    if (lastTicketError) {
      throw new Error(lastTicketError.message);
    }

    const nextNumber =
      lastTicket && lastTicket.length > 0
        ? lastTicket[0].number + 1
        : 1;

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        queue_code: normalizedCode,
        number: nextNumber,
        guest_name: guestName.slice(0, 48),
        status: "waiting",
      })
      .select()
      .single();

    if (ticketError || !ticket) {
      console.error("Ticket creation error:", ticketError);

      return Response.json(
        {
          error: ticketError?.message || "Could not join queue.",
        },
        { status: 500 },
      );
    }

    const queueSnapshot = await getQueueSnapshot(normalizedCode);

    if (!queueSnapshot) {
      return Response.json(
        { error: "Queue not found." },
        { status: 404 },
      );
    }

    const formattedTicket = {
      id: ticket.id,
      number: ticket.number,
      guestName: ticket.guest_name,
      status: ticket.status,
      joinedAt: ticket.joined_at,
      calledAt: ticket.called_at,
      completedAt: ticket.completed_at,
    };

    return Response.json(
      {
        queue: queueSnapshot,
        ticket: formattedTicket,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Join queue error:", error);

    return Response.json(
      { error: "Could not join the queue." },
      { status: 500 },
    );
  }
}
