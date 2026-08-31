import { randomBytes } from "node:crypto";
import { snapshot, type Queue, type QueueSnapshot, type Ticket } from "./types";

type Memory = {
  queues: Map<string, Queue>;
};

const g = globalThis as typeof globalThis & { __queuezero?: Memory };

function memory(): Memory {
  if (!g.__queuezero) {
    g.__queuezero = { queues: new Map() };
    seed(g.__queuezero);
  }
  return g.__queuezero;
}

function id(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function seed(store: Memory) {
  const demo: Queue = {
    code: "DEMO",
    name: "Walk-in barber line",
    venue: "Northside Cuts",
    avgMinutes: 12,
    paused: false,
    createdAt: new Date().toISOString(),
    tickets: [
      {
        id: "tkt_demo_01",
        number: 1,
        guestName: "Priya S.",
        status: "serving",
        joinedAt: new Date(Date.now() - 18 * 60_000).toISOString(),
        calledAt: new Date(Date.now() - 8 * 60_000).toISOString(),
        completedAt: null,
      },
      {
        id: "tkt_demo_02",
        number: 2,
        guestName: "Marcus L.",
        status: "waiting",
        joinedAt: new Date(Date.now() - 9 * 60_000).toISOString(),
        calledAt: null,
        completedAt: null,
      },
      {
        id: "tkt_demo_03",
        number: 3,
        guestName: "Elena V.",
        status: "waiting",
        joinedAt: new Date(Date.now() - 4 * 60_000).toISOString(),
        calledAt: null,
        completedAt: null,
      },
    ],
  };
  store.queues.set(demo.code, demo);
}

export function getQueue(code: string): Queue | null {
  return memory().queues.get(code.toUpperCase()) ?? null;
}

export function getSnapshot(code: string): QueueSnapshot | null {
  const queue = getQueue(code);
  return queue ? snapshot(queue) : null;
}

export function createQueue(input: {
  name: string;
  venue: string;
  avgMinutes: number;
}): QueueSnapshot {
  const store = memory();
  let code = makeCode();
  while (store.queues.has(code)) {
    code = makeCode();
  }

  const queue: Queue = {
    code,
    name: input.name.trim(),
    venue: input.venue.trim(),
    avgMinutes: Math.max(1, Math.min(120, Math.round(input.avgMinutes))),
    paused: false,
    createdAt: new Date().toISOString(),
    tickets: [],
  };

  store.queues.set(code, queue);
  return snapshot(queue);
}

export function setPaused(code: string, paused: boolean): QueueSnapshot | null {
  const queue = getQueue(code);
  if (!queue) return null;
  queue.paused = paused;
  return snapshot(queue);
}

export function joinQueue(
  code: string,
  guestName: string,
): { queue: QueueSnapshot; ticket: Ticket } | { error: string; status: number } {
  const queue = getQueue(code);
  if (!queue) return { error: "Queue not found.", status: 404 };
  if (queue.paused) {
    return { error: "This line is paused. Try again shortly.", status: 409 };
  }

  const name = guestName.trim();
  if (name.length < 2) {
    return { error: "Please enter a name (at least 2 characters).", status: 400 };
  }

  const nextNumber =
    queue.tickets.reduce((max, ticket) => Math.max(max, ticket.number), 0) + 1;

  const ticket: Ticket = {
    id: id("tkt"),
    number: nextNumber,
    guestName: name.slice(0, 48),
    status: "waiting",
    joinedAt: new Date().toISOString(),
    calledAt: null,
    completedAt: null,
  };

  queue.tickets.push(ticket);
  return { queue: snapshot(queue), ticket };
}

export function callNext(code: string): QueueSnapshot | { error: string; status: number } {
  const queue = getQueue(code);
  if (!queue) return { error: "Queue not found.", status: 404 };

  const serving = queue.tickets.find((t) => t.status === "serving");
  if (serving) {
    serving.status = "done";
    serving.completedAt = new Date().toISOString();
  }

  const next = queue.tickets.find((t) => t.status === "waiting");
  if (!next) {
    return snapshot(queue);
  }

  next.status = "serving";
  next.calledAt = new Date().toISOString();
  return snapshot(queue);
}

export function updateTicket(
  code: string,
  ticketId: string,
  action: "complete" | "skip" | "recall",
): QueueSnapshot | { error: string; status: number } {
  const queue = getQueue(code);
  if (!queue) return { error: "Queue not found.", status: 404 };

  const ticket = queue.tickets.find((t) => t.id === ticketId);
  if (!ticket) return { error: "Ticket not found.", status: 404 };

  if (action === "complete") {
    ticket.status = "done";
    ticket.completedAt = new Date().toISOString();
  } else if (action === "skip") {
    ticket.status = "skipped";
    ticket.completedAt = new Date().toISOString();
  } else {
    ticket.status = "waiting";
    ticket.calledAt = null;
    ticket.completedAt = null;
  }

  return snapshot(queue);
}

export function getTicket(code: string, ticketId: string) {
  const queue = getQueue(code);
  if (!queue) return null;
  const ticket = queue.tickets.find((t) => t.id === ticketId);
  if (!ticket) return null;
  return { queue: snapshot(queue), ticket };
}
