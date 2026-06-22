"use client";

import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState("done");
      setMsg(data.message || "You're on the list! ✅");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Try again");
    }
  }

  if (state === "done") {
    return (
      <div className="success">
        ✅ {msg}
        <div style={{ fontWeight: 400, opacity: 0.85, marginTop: 4 }}>
          We&apos;ll email you the moment tickets drop.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="emailrow">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "loading"}
        />
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "..." : "Alert me"}
        </button>
      </div>
      {state === "error" && (
        <div className="micro" style={{ color: "#ffd7d5", fontWeight: 700 }}>
          ⚠ {msg}
        </div>
      )}
      <div className="micro">Free for Moroccan fans · Unsubscribe anytime</div>
    </form>
  );
}
