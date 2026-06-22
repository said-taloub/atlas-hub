# Atlas Hub 🇲🇦 — Morocco at the World Cup 2026

A free, mobile-first hub for Moroccan fans at the 2026 World Cup (USA · Canada · Mexico).
Everything fans need in one place: next match countdown, ticket-drop email alerts,
halal food, mosques, stadium transport and Moroccan fan zones.

## Features

- ⚽ **Next match** with a live countdown and dual clock (venue time + Morocco time)
- 🎟️ **Ticket alerts** — email signup; FIFA releases batches daily at 11:00 AM ET
- 🏙️ **Per host-city** info (Atlanta, New York, Boston): transport, fan zones, halal, mosques
- 🚇 **Stadium transport** guides with the real "buy your ticket in advance" gotchas

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- Deployed on [Vercel](https://vercel.com)
- Email storage: Supabase (optional) with a zero-config local JSON fallback

## Local development

```bash
npm install
npm run dev    # http://localhost:3000
```

The email form works immediately in dev — submissions are written to
`.data/subscribers.json` (git-ignored).

## Production email storage (Supabase)

Set these environment variables in Vercel to store subscribers in Supabase:

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Create the table:

```sql
create table subscribers (
  email text primary key,
  created_at timestamptz default now()
);
```

If the variables are absent, the app falls back to the local JSON file.

## Updating content

All match and city data lives in [`lib/data.ts`](./lib/data.ts) — edit that one
file to update matches, kickoff times, transport steps, and fan zones.

---

Built with ❤️ for Moroccan fans.
