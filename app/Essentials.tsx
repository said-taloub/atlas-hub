"use client";

import { useState } from "react";
import { googleMapsUrl, wazeUrl, type City } from "@/lib/data";
import type { Place } from "./api/places/route";

type Kind = "mosque" | "halal";

interface TileMeta {
  kind: Kind;
  emoji: string;
  title: string;
  blurb: string;
}

const TILES: TileMeta[] = [
  {
    kind: "mosque",
    emoji: "🕌",
    title: "Mosques",
    blurb: "Prayer times & nearest masjid to the stadium",
  },
  {
    kind: "halal",
    emoji: "🥙",
    title: "Halal Food",
    blurb: "Verified halal restaurants near the ground",
  },
];

type LoadState = "idle" | "loading" | "loaded" | "error";

export default function Essentials({ city }: { city: City }) {
  const [open, setOpen] = useState<Kind | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [places, setPlaces] = useState<Place[]>([]);
  // Cache results per (kind+city) so re-opening a tile is instant.
  const [cache] = useState<Map<string, Place[]>>(() => new Map());

  async function toggle(kind: Kind) {
    if (open === kind) {
      setOpen(null);
      return;
    }
    setOpen(kind);

    const cacheKey = `${kind}:${city}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      setPlaces(cached);
      setState("loaded");
      return;
    }

    setState("loading");
    try {
      const res = await fetch(`/api/places?kind=${kind}&city=${city}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: { places: Place[] } = await res.json();
      cache.set(cacheKey, data.places);
      setPlaces(data.places);
      setState(data.places.length ? "loaded" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="essentials">
      <div className="grid">
        {TILES.map((t) => (
          <button
            key={t.kind}
            className={`tile ${open === t.kind ? "tile-open" : ""}`}
            onClick={() => toggle(t.kind)}
            aria-expanded={open === t.kind}
          >
            <span className="em">{t.emoji}</span>
            <h4>{t.title}</h4>
            <p>{t.blurb}</p>
            <span className="tile-cta">
              {open === t.kind ? "Hide list ▲" : "Show nearby ▼"}
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="placelist">
          {state === "loading" && (
            <div className="pl-loading">
              <span className="spinner" />
              Finding {open === "mosque" ? "mosques" : "halal spots"} near the
              stadium…
            </div>
          )}

          {state === "error" && (
            <div className="pl-empty">
              Couldn&apos;t load places right now — try again in a moment.
            </div>
          )}

          {state === "loaded" &&
            places.map((p, i) => (
              <div key={i} className="placerow">
                <div className="pl-info">
                  <b>{p.name}</b>
                  <span className="pl-addr">{p.address}</span>
                  <span className="pl-meta">
                    {p.rating != null && <span>⭐ {p.rating.toFixed(1)}</span>}
                    {p.open === true && <span className="pl-open">Open now</span>}
                    {p.open === false && (
                      <span className="pl-closed">Closed</span>
                    )}
                  </span>
                </div>
                <div className="pl-nav">
                  <a
                    href={googleMapsUrl({ lat: p.lat, lng: p.lng }, p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Directions to ${p.name} on Google Maps`}
                  >
                    🗺️
                  </a>
                  <a
                    href={wazeUrl({ lat: p.lat, lng: p.lng })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Navigate to ${p.name} on Waze`}
                  >
                    🚗
                  </a>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
