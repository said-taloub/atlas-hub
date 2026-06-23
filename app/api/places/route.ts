import { NextResponse } from "next/server";
import { CITIES, type City } from "@/lib/data";

export const runtime = "nodejs";
// Cache each (city, kind) result for 24h so a fan tapping the tile repeatedly
// doesn't burn the Google Places quota. Places like mosques/restaurants are
// stable enough that daily freshness is plenty.
export const revalidate = 86400;

type Kind = "mosque" | "halal";

const QUERIES: Record<Kind, string> = {
  mosque: "mosque",
  halal: "halal restaurant",
};

export interface Place {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number | null;
  open: boolean | null;
}

/** Calls Google Places (New) Text Search, biased around the stadium. */
async function fetchPlaces(kind: Kind, city: City): Promise<Place[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("missing GOOGLE_PLACES_API_KEY");

  const { coords, name } = CITIES[city].stadium;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.location,places.rating,places.currentOpeningHours.openNow",
    },
    body: JSON.stringify({
      textQuery: `${QUERIES[kind]} near ${name}`,
      maxResultCount: 8,
      // Bias results to a 15km circle around the stadium.
      locationBias: {
        circle: {
          center: { latitude: coords.lat, longitude: coords.lng },
          radius: 15000,
        },
      },
    }),
    // Let Next.js cache the upstream response per the route's revalidate.
    next: { revalidate },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`places ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    places?: Array<{
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
      rating?: number;
      currentOpeningHours?: { openNow?: boolean };
    }>;
  };

  return (data.places ?? [])
    .filter((p) => p.location && p.displayName?.text)
    .map((p) => ({
      name: p.displayName!.text!,
      address: p.formattedAddress ?? "",
      lat: p.location!.latitude,
      lng: p.location!.longitude,
      rating: typeof p.rating === "number" ? p.rating : null,
      open: p.currentOpeningHours?.openNow ?? null,
    }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");
  const city = searchParams.get("city");

  if (kind !== "mosque" && kind !== "halal") {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }
  if (!city || !(city in CITIES)) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  try {
    const places = await fetchPlaces(kind, city as City);
    return NextResponse.json({ places });
  } catch (err) {
    console.error("places error:", err);
    return NextResponse.json(
      { error: "Couldn't load places right now." },
      { status: 500 }
    );
  }
}
