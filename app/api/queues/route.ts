import { createQueue } from "@/lib/store";

export async function POST(request: Request) {
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

  const queue = createQueue({ name, venue, avgMinutes });
  return Response.json({ queue }, { status: 201 });
}
