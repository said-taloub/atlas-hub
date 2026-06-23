// ── Atlas Hub data ──────────────────────────────────────────────
// Single source of truth. Update this file to keep the hub accurate.
// Times are stored as ISO strings WITH the venue's UTC offset so the
// countdown and dual-clock work no matter where the visitor is.

export type City = "atlanta" | "newyork" | "boston";

export interface MatchResult {
  morocco: number;
  opponent: number;
  /** Short note, e.g. "Saibari 11s — fastest WC goal in Morocco history". */
  note?: string;
}

export interface Match {
  opponent: string;
  opponentFlag: string;
  /** "Group C", "Round of 32", "Round of 16", etc. */
  round: string;
  city: City;
  cityLabel: string;
  stadium: string;
  /** Kickoff in ISO 8601 with venue offset, e.g. 2026-06-24T18:00:00-04:00 */
  kickoff: string;
  /** Whether the opponent is confirmed (false for future knockout rounds). */
  confirmed: boolean;
  /** Present only once the match is finished. */
  result?: MatchResult;
}

// Morocco's full World Cup 2026 journey — the single source of truth.
// The whole app (next match, host city, transport, fan zone) derives from it.
//
// ── HOW TO UPDATE (manual / via the /update skill) ──────────────────────────
// 1. A MATCH JUST FINISHED → add a `result` to that match object:
//        result: { morocco: 2, opponent: 0, note: "..." }
//    The app auto-advances: that game shows its score, the next becomes NEXT,
//    and the host city / transport / fan zone follow the new next match.
//
// 2. MOROCCO ADVANCED but the next opponent/venue isn't announced yet → append
//    a match with `confirmed: false` and a best-guess city. The Home shows a
//    "next round venue" loading placeholder until you flip it to confirmed.
//
// 3. NEXT OPPONENT ANNOUNCED → set `confirmed: true` and fill opponent/flag/
//    stadium/kickoff. If it's a new host city, add it to CITIES below too.
// ────────────────────────────────────────────────────────────────────────────
export const MATCHES: Match[] = [
  {
    opponent: "Brazil",
    opponentFlag: "🇧🇷",
    round: "Group C",
    city: "newyork",
    cityLabel: "New York",
    stadium: "MetLife Stadium",
    kickoff: "2026-06-13T18:00:00-04:00",
    confirmed: true,
    result: { morocco: 1, opponent: 1, note: "A heroic draw against Brazil" },
  },
  {
    opponent: "Scotland",
    opponentFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    round: "Group C",
    city: "boston",
    cityLabel: "Boston",
    stadium: "Gillette Stadium",
    kickoff: "2026-06-20T15:00:00-04:00",
    confirmed: true,
    result: {
      morocco: 1,
      opponent: 0,
      note: "Saibari scores the fastest WC goal in Morocco history",
    },
  },
  {
    opponent: "Haiti",
    opponentFlag: "🇭🇹",
    round: "Group C",
    city: "atlanta",
    cityLabel: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    kickoff: "2026-06-24T18:00:00-04:00",
    confirmed: true,
  },
];

/** A finished match has a result. */
export function isDone(m: Match): boolean {
  return m.result !== undefined;
}

/** Returns the next not-yet-finished match, or null if the journey is over. */
export function nextMatch(): Match | null {
  return MATCHES.find((m) => !isDone(m)) ?? null;
}

/** Points earned so far (3 win / 1 draw / 0 loss) across finished group games. */
export function moroccoPoints(): number {
  return MATCHES.filter(isDone).reduce((pts, m) => {
    const r = m.result!;
    if (r.morocco > r.opponent) return pts + 3;
    if (r.morocco === r.opponent) return pts + 1;
    return pts;
  }, 0);
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CityInfo {
  id: City;
  label: string;
  flag: string;
  /** City center, used to find the nearest host city from device GPS. */
  center: GeoPoint;
  stadium: { name: string; coords: GeoPoint };
  transport: { title: string; detail: string; warn?: boolean }[];
  fanZone: {
    name: string;
    place: string;
    opens: string;
    note: string;
    coords: GeoPoint;
  };
  mosques: number;
  halal: number;
}

export const CITIES: Record<City, CityInfo> = {
  atlanta: {
    id: "atlanta",
    label: "Atlanta",
    flag: "🍑",
    center: { lat: 33.749, lng: -84.388 },
    stadium: {
      name: "Mercedes-Benz Stadium",
      coords: { lat: 33.7554, lng: -84.4008 },
    },
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
      coords: { lat: 33.7603, lng: -84.3933 },
    },
  },
  newyork: {
    id: "newyork",
    label: "New York",
    flag: "🗽",
    center: { lat: 40.7128, lng: -74.006 },
    stadium: {
      name: "MetLife Stadium",
      coords: { lat: 40.8128, lng: -74.0742 },
    },
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
      coords: { lat: 40.7057, lng: -74.0551 },
    },
  },
  boston: {
    id: "boston",
    label: "Boston",
    flag: "🦞",
    center: { lat: 42.3601, lng: -71.0589 },
    stadium: {
      name: "Gillette Stadium",
      coords: { lat: 42.0909, lng: -71.2643 },
    },
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
      coords: { lat: 42.3551, lng: -71.0657 },
    },
  },
};

// ── Geo & navigation helpers ────────────────────────────────────

/** Haversine distance in km between two points. */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Closest host city to a GPS point — used after the user shares location. */
export function nearestCity(p: GeoPoint): City {
  return (Object.values(CITIES) as CityInfo[])
    .map((c) => ({ id: c.id, d: distanceKm(p, c.center) }))
    .sort((a, b) => a.d - b.d)[0].id;
}

/** Deep link that opens Google Maps directions to a destination.
 * Uses the official Maps URL scheme: only `destination` (lat,lng) is required.
 * The optional label rides along in `destination` text so the pin is named. */
export function googleMapsUrl(dest: GeoPoint, label?: string): string {
  // `destination` accepts either "lat,lng" or a place name. We send the
  // coordinates (always resolvable) and let Google show transit directions.
  const destination = label
    ? encodeURIComponent(`${label} ${dest.lat},${dest.lng}`)
    : `${dest.lat},${dest.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=transit`;
}

/** Deep link that opens Waze navigation to a destination. */
export function wazeUrl(dest: GeoPoint): string {
  // `ll` = target coords, `navigate=yes` starts routing immediately.
  return `https://www.waze.com/ul?ll=${dest.lat}%2C${dest.lng}&navigate=yes&zoom=17`;
}
