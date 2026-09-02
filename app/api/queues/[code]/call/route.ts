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

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/queues/[code]/call">,
) {
  try {
    const { code } = await ctx.params;
    const normalizedCode = code.toUpperCase();

    // Check that queue exists
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

    // Find the first waiting ticket
    const { data: waitingTickets, error: ticketError } = await supabase
      .from("tickets")
      .select("*")
      .eq("queue_code", normalizedCode)
      .eq("status", "waiting")
      .order("number", { ascending: true })
      .limit(1);

    if (ticketError) {
      throw new Error(ticketError.message);
    }

    if (!waitingTickets || waitingTickets.length === 0) {
      return Response.json(
        { error: "Nobody is waiting." },
        { status: 409 },
      );
    }

    const nextTicket = waitingTickets[0];

    // If someone is currently being served,
    // leave them as serving for now — we will explicitly
    // complete or skip them using the Host Desk buttons.

    const { error: updateError } = await supabase
      .from("tickets")
      .update({
        status: "serving",
        called_at: new Date().toISOString(),
      })
      .eq("id", nextTicket.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    const snapshot = await getQueueSnapshot(normalizedCode);

    return Response.json({ queue: snapshot });
  } catch (error) {
    console.error("Call next error:", error);

    return Response.json(
      { error: "Could not call the next guest." },
      { status: 500 },
    );
  }
}