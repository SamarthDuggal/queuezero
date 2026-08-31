import { GuestTicket } from "@/components/GuestTicket";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your ticket" };

export default async function TicketPage({
  params,
}: PageProps<"/ticket/[code]/[ticketId]">) {
  const { code, ticketId } = await params;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <GuestTicket code={code.toUpperCase()} ticketId={ticketId} />
    </div>
  );
}
