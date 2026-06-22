// ── Atlas Hub data ──────────────────────────────────────────────
// Single source of truth. Update this file to keep the hub accurate.
// Times are stored as ISO strings WITH the venue's UTC offset so the
// countdown and dual-clock work no matter where the visitor is.

export type City = "atlanta" | "newyork" | "boston";

export interface Match {
  opponent: string;
  opponentFlag: string;
  group: string;
  city: City;
  cityLabel: string;
  stadium: string;
  /** Kickoff in ISO 8601 with venue offset, e.g. 2026-06-24T18:00:00-04:00 */
  kickoff: string;
  status: "upcoming" | "live" | "done";
}

export const MATCHES: Match[] = [
  {
    opponent: "Haiti",
    opponentFlag: "🇭🇹",
    group: "Group C",
    city: "atlanta",
    cityLabel: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    kickoff: "2026-06-24T18:00:00-04:00",
    status: "upcoming",
  },
];

/** Returns the next non-finished match, or null. */
export function nextMatch(now: Date = new Date()): Match | null {
  const upcoming = MATCHES.filter(
    (m) => new Date(m.kickoff).getTime() > now.getTime() - 2 * 60 * 60 * 1000
  ).sort((a, b) => +new Date(a.kickoff) - +new Date(b.kickoff));
  return upcoming[0] ?? null;
}

export interface CityInfo {
  id: City;
  label: string;
  flag: string;
  transport: { title: string; detail: string; warn?: boolean }[];
  fanZone: { name: string; place: string; opens: string; note: string };
  mosques: number;
  halal: number;
}

export const CITIES: Record<City, CityInfo> = {
  atlanta: {
    id: "atlanta",
    label: "Atlanta",
    flag: "🍑",
    mosques: 3,
    halal: 12,
    transport: [
      {
        title: "Take MARTA rail",
        detail:
          "Blue or Green line toward downtown — avoid driving, parking fills early.",
      },
      {
        title: "Get off at Vine City or GWCC",
        detail: "Short 5-min walk to Mercedes-Benz Stadium gates.",
      },
      {
        title: "Leave 90 min early",
        detail: "Security & crowd lines are long on matchday.",
        warn: true,
      },
    ],
    fanZone: {
      name: "Atlas Lions Gathering 🦁",
      place: "Centennial Olympic Park",
      opens: "2:00 PM · 4h before kickoff",
      note: "Drums, chants & screens — find your people",
    },
  },
  newyork: {
    id: "newyork",
    label: "New York",
    flag: "🗽",
    mosques: 20,
    halal: 60,
    transport: [
      {
        title: "Train from Penn Station",
        detail: "NJ Transit to Secaucus Junction, then the Meadowlands line.",
      },
      {
        title: "Buy your train ticket in advance",
        detail: "Tickets are NOT sold on matchday — capacity is limited.",
        warn: true,
      },
      {
        title: "A match ticket is required to board",
        detail: "The Meadowlands shuttle checks for a valid game ticket.",
      },
    ],
    fanZone: {
      name: "Atlas Lions NYC 🦁",
      place: "Liberty State Park (TBC)",
      opens: "Check the day before kickoff",
      note: "Largest Moroccan diaspora gathering on the East Coast",
    },
  },
  boston: {
    id: "boston",
    label: "Boston",
    flag: "🦞",
    mosques: 5,
    halal: 18,
    transport: [
      {
        title: "Take the MBTA Commuter Rail",
        detail: "Special matchday trains run to Gillette Stadium, Foxborough.",
      },
      {
        title: "Reserve your seat ahead",
        detail: "Matchday trains sell out — book before you travel.",
        warn: true,
      },
      {
        title: "Arrive early",
        detail: "Gillette is outside the city — allow extra travel time.",
      },
    ],
    fanZone: {
      name: "Atlas Lions Boston 🦁",
      place: "Boston Common (TBC)",
      opens: "Check the day before kickoff",
      note: "Meet fellow supporters before heading to Foxborough",
    },
  },
};
