import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Stores a subscriber email.
 *
 * Production: if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, it inserts
 * into the `subscribers` table via the REST API (no extra dependency needed).
 * Local dev fallback: appends to .data/subscribers.json so the form works
 * out of the box with zero setup.
 */
async function saveEmail(email: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ email }),
    });
    if (!res.ok && res.status !== 409) {
      throw new Error(`store failed (${res.status})`);
    }
    return;
  }

  // Local dev fallback
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "subscribers.json");
  await fs.mkdir(dir, { recursive: true });
  let list: { email: string; at: string }[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    // file doesn't exist yet
  }
  if (!list.some((r) => r.email === email)) {
    list.push({ email, at: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(list, null, 2));
  }
}

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email" },
      { status: 400 }
    );
  }

  try {
    await saveEmail(email.trim().toLowerCase());
    return NextResponse.json({ message: "You're on the list!" });
  } catch (err) {
    console.error("subscribe error:", err);
    return NextResponse.json(
      { error: "Couldn't save right now. Try again." },
      { status: 500 }
    );
  }
}
