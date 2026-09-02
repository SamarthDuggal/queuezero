import type { QueueSnapshot, Ticket } from "./types";

async function parse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(body.error || "Request failed.");
  }
  return body;
}

export function createQueue(input: {
  name: string;
  venue: string;
  avgMinutes: number;
}) {
  return fetch("/api/queues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).then((res) => parse<{ queue: QueueSnapshot }>(res));
}

export function fetchQueue(code: string) {
  return fetch(`/api/queues/${code}`, { cache: "no-store" }).then((res) =>
    parse<{ queue: QueueSnapshot }>(res),
  );
}

export function pauseQueue(code: string, paused: boolean) {
  return fetch(`/api/queues/${code}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paused }),
  }).then((res) => parse<{ queue: QueueSnapshot }>(res));
}

export function joinQueue(code: string, guestName: string) {
  return fetch(`/api/queues/${code}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestName }),
  }).then((res) => parse<{ queue: QueueSnapshot; ticket: Ticket }>(res));
}

export function callNext(code: string) {
  return fetch(`/api/queues/${code}/call`, { method: "POST" }).then((res) =>
    parse<{ queue: QueueSnapshot }>(res),
  );
}

export function updateTicket(
  code: string,
  ticketId: string,
  action: "complete" | "skip" | "recall",
) {
  return fetch(`/api/queues/${code}/tickets/${ticketId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  }).then((res) => parse<{ queue: QueueSnapshot }>(res));
}

export function fetchTicket(code: string, ticketId: string) {
  return fetch(`/api/queues/${code}/tickets/${ticketId}`, {
    cache: "no-store",
  }).then((res) => parse<{ queue: QueueSnapshot; ticket: Ticket }>(res));
}
export function deleteQueue(code: string) {
  return fetch(`/api/queues/${code}`, {
    method: "DELETE",
  }).then((res) => parse<{ success: boolean; message: string }>(res));
}