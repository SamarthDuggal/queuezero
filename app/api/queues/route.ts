import { supabase } from "@/lib/supabase";

function generateQueueCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      venue?: string;
      avgMinutes?: number;
    };

    const name = body.name?.trim() ?? "";
    const venue = body.venue?.trim() ?? "";
    const avgMinutes = Number(body.avgMinutes ?? 8);

    if (name.length < 2 || venue.length < 2) {
      return Response.json(
        { error: "Give the line and venue a short name." },
        { status: 400 },
      );
    }

    const code = generateQueueCode();

    const { data, error } = await supabase
      .from("queues")
      .insert({
        code,
        name,
        venue,
        avg_minutes: avgMinutes,
        paused: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase queue creation error:", error);

      return Response.json(
        {
          error: "Could not create queue.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    const queue = {
      id: data.id,
      code: data.code,
      name: data.name,
      venue: data.venue,
      avgMinutes: data.avg_minutes,
      paused: data.paused,
      createdAt: data.created_at,
      tickets: [],
    };

    return Response.json({ queue }, { status: 201 });
  } catch (error) {
    console.error("Queue API error:", error);

    return Response.json(
      { error: "Something went wrong while creating the queue." },
      { status: 500 },
    );
  }
}