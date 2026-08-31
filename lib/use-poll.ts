"use client";

import { useCallback, useEffect, useState } from "react";

export function usePoll<T>(loader: () => Promise<T>, intervalMs = 2000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const next = await loader();
      setData(next);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load.");
    }
  }, [loader]);

  useEffect(() => {
    const kickoff = window.setTimeout(() => {
      void refresh();
    }, 0);
    const timer = window.setInterval(() => {
      void refresh();
    }, intervalMs);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, [intervalMs, refresh]);

  return { data, error, refresh, setData };
}
