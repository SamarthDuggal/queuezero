export type TicketStatus = "waiting" | "serving" | "done" | "skipped";

export type Ticket = {
  id: string;
  number: number;
  guestName: string;
  status: TicketStatus;
  joinedAt: string;
  calledAt: string | null;
  completedAt: string | null;
};

export type Queue = {
  code: string;
  name: string;
  venue: string;
  avgMinutes: number;
  paused: boolean;
  createdAt: string;
  tickets: Ticket[];
};

export type QueueSnapshot = Queue & {
  nowServing: Ticket | null;
  waiting: Ticket[];
  servedToday: number;
  estimatedWaitMinutes: number;
};

export function snapshot(queue: Queue): QueueSnapshot {
  const waiting = queue.tickets.filter((t) => t.status === "waiting");
  const serving = queue.tickets.filter((t) => t.status === "serving");
  const nowServing = serving.at(-1) ?? null;
  const servedToday = queue.tickets.filter((t) => t.status === "done").length;

  return {
    ...queue,
    nowServing,
    waiting,
    servedToday,
    estimatedWaitMinutes: waiting.length * queue.avgMinutes,
  };
}

export function ticketLabel(number: number) {
  return `A${String(number).padStart(3, "0")}`;
}

export function positionInLine(queue: Queue, ticketId: string) {
  const waiting = queue.tickets.filter((t) => t.status === "waiting");
  const index = waiting.findIndex((t) => t.id === ticketId);
  return index === -1 ? null : index + 1;
}
