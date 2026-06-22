"use client";

import { useEffect, useState } from "react";

function diff(target: number, now: number) {
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  return { days, hours, mins, done: ms === 0 };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({ kickoff }: { kickoff: string }) {
  const target = new Date(kickoff).getTime();
  // Start null to avoid hydration mismatch; fill in on the client.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, mins, done } = diff(target, now ?? target);

  if (now !== null && done) {
    return (
      <div className="count">
        <div className="cbox" style={{ minWidth: "auto", padding: "8px 16px" }}>
          <b style={{ fontSize: 16 }}>🔴 LIVE NOW</b>
          <span>Kickoff</span>
        </div>
      </div>
    );
  }

  return (
    <div className="count" suppressHydrationWarning>
      <div className="cbox">
        <b>{now === null ? "--" : pad(days)}</b>
        <span>Days</span>
      </div>
      <div className="cbox">
        <b>{now === null ? "--" : pad(hours)}</b>
        <span>Hours</span>
      </div>
      <div className="cbox">
        <b>{now === null ? "--" : pad(mins)}</b>
        <span>Min</span>
      </div>
    </div>
  );
}
