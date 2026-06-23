"use client";

import { useMemo, useState } from "react";
import {
  CITIES,
  MATCHES,
  googleMapsUrl,
  isDone,
  moroccoPoints,
  nearestCity,
  nextMatch,
  wazeUrl,
  type City,
} from "@/lib/data";
import Countdown from "./Countdown";
import SignupForm from "./SignupForm";
import Essentials from "./Essentials";

const MOROCCO_TZ = "Africa/Casablanca";

function fmtTime(iso: string, tz?: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  }).format(new Date(iso));
}

function fmtDate(iso: string) {
  // Show the date in the venue (ET) time zone to match the displayed kickoff,
  // so a fan viewing from Morocco still sees the correct matchday.
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(iso));
}

export default function Page() {
  const match = nextMatch();
  // The host city always follows Morocco's next match (or the last one played
  // if the journey is over). It is not manually selectable anymore.
  const city: City = (match ?? MATCHES[MATCHES.length - 1]).city;
  const info = CITIES[city];

  // Geolocation is informational only: it tells the fan which host city they're
  // closest to, without overriding the next-match city.
  const [geoState, setGeoState] = useState<"idle" | "locating" | "done" | "denied">(
    "idle"
  );
  const [geoCity, setGeoCity] = useState<City | null>(null);
  const geoMatch = geoState === "done" && geoCity === city;

  // True when Morocco has a confirmed knockout spot but the next opponent/venue
  // isn't scheduled yet — drives the "next round venue" loading placeholder.
  const nextRoundPending = match !== null && !match.confirmed;

  const localTime = useMemo(
    () => (match ? fmtTime(match.kickoff) : ""),
    [match]
  );
  const moroccoTime = useMemo(
    () => (match ? fmtTime(match.kickoff, MOROCCO_TZ) : ""),
    [match]
  );

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setGeoState("denied");
      return;
    }
    setGeoState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = nearestCity({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoCity(nearest);
        setGeoState("done");
      },
      () => setGeoState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  }

  return (
    <div className="app">
      {/* HERO */}
      <header className="hero">
        <div className="brandrow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="star" src="/icon.svg" alt="Atlas Fan lion" />
          <div className="brand">
            Atlas Fan
            <small>Morocco · World Cup 2026</small>
          </div>
          <div className="live">
            <span className="dot" />
            LIVE
          </div>
        </div>

        {match ? (
          <div className="matchcard">
            <div className="mc-top">
              <span>Next Match</span>
              <span className="grp">{match.round}</span>
            </div>
            <div className="teams">
              <div className="team">
                <div className="flag">🇲🇦</div>
                <b>Morocco</b>
              </div>
              <div className="vs">VS</div>
              <div className="team">
                <div className="flag">{match.opponentFlag}</div>
                <b>{match.confirmed ? match.opponent : "TBD"}</b>
              </div>
            </div>

            <Countdown kickoff={match.kickoff} />

            <div className="times">
              <div className="pill">
                <small>📍 {match.cityLabel} (ET)</small>
                <b>{localTime}</b>
              </div>
              <div className="pill">
                <small>🇲🇦 Morocco time</small>
                <b>{moroccoTime}</b>
              </div>
            </div>

            <div className="mc-foot">
              <div>🏟️ {match.stadium}</div>
              <div>📅 {fmtDate(match.kickoff)}</div>
            </div>
          </div>
        ) : (
          <div className="matchcard">
            <div className="mc-top">
              <span>The journey</span>
              <span className="grp">{moroccoPoints()} pts</span>
            </div>
            <p style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>
              No upcoming match scheduled yet. Check back for the next round —
              Dima Maghrib! 🇲🇦
            </p>
          </div>
        )}
      </header>

      <main className="body">
        {/* TICKET ALERT */}
        <div className="sec-title">Ticket Alerts</div>
        <div className="alert">
          <h3>Don&apos;t miss a ticket drop 🎟️</h3>
          <p>
            FIFA releases new ticket batches daily at <b>11:00 AM ET</b>. Get an
            email the moment seats open.
          </p>
          <SignupForm />
        </div>

        {/* MOROCCO'S JOURNEY */}
        <div className="sec-title">Morocco&apos;s Journey</div>
        <div className="journey">
          {MATCHES.map((m, i) => {
            const done = isDone(m);
            const win =
              done && m.result!.morocco > m.result!.opponent;
            const draw =
              done && m.result!.morocco === m.result!.opponent;
            const badge = !done
              ? "next"
              : win
              ? "win"
              : draw
              ? "draw"
              : "loss";
            return (
              <div key={i} className={`jrow ${badge}`}>
                <div className="jdate">{fmtDate(m.kickoff)}</div>
                <div className="jmatch">
                  <span className="jflags">
                    🇲🇦 <b>{m.confirmed ? m.opponent : "TBD"}</b> {m.opponentFlag}
                  </span>
                  <span className="jround">
                    {m.round} · {m.cityLabel}
                  </span>
                </div>
                <div className="jscore">
                  {done ? (
                    <b>
                      {m.result!.morocco}–{m.result!.opponent}
                    </b>
                  ) : (
                    <span className="jnext">NEXT</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* HOST CITY — anchored on the next match's city */}
        <div className="sec-title">Your Host City</div>
        <div className="cities">
          <div className={`chip active ${geoMatch ? "geo-on" : ""}`}>
            <span className="f">{info.flag}</span>
            {info.label}
            {match ? <span className="chip-sub">Next match</span> : null}
          </div>
          <button
            className="chip geo"
            onClick={useMyLocation}
            disabled={geoState === "locating"}
          >
            📍 {geoState === "locating" ? "Locating…" : "Near me"}
          </button>
        </div>
        {geoState === "done" && !geoMatch && (
          <div className="geo-hint">
            You&apos;re closest to <b>{CITIES[geoCity!].label}</b> — but Morocco
            plays next in <b>{info.label}</b>.
          </div>
        )}
        {geoState === "denied" && (
          <div className="geo-hint">
            Couldn&apos;t get your location — that&apos;s okay, the host city
            follows Morocco&apos;s next match.
          </div>
        )}

        {/* Placeholder for the next round, shown once Morocco advances but the
            opponent/venue isn't scheduled yet. */}
        {nextRoundPending && (
          <div className="nextcity-loading">
            <span className="spinner" />
            <div>
              <b>Next round venue</b>
              <p>
                Morocco advanced 🎉 — the next opponent &amp; host city drop soon.
                This updates automatically.
              </p>
            </div>
          </div>
        )}

        {/* ESSENTIALS */}
        <div className="sec-title">Essentials Near You</div>
        <Essentials city={city} />

        {/* TRANSPORT */}
        <div className="sec-title">Stadium Transport — {info.label}</div>
        <div className="steps">
          {info.transport.map((s, i) => (
            <div key={i} className={`step ${s.warn ? "warn" : ""}`}>
              <div className="num">{s.warn ? "!" : i + 1}</div>
              <div className="txt">
                <b>{s.title}</b>
                <p>{s.detail}</p>
                {s.warn && (
                  <span className="warnpill">
                    ⚠ Tickets are digital-only via the FIFA app
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="nav-btns">
            <a
              className="nav-btn maps"
              href={googleMapsUrl(info.stadium.coords, info.stadium.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺️ Directions (Maps)
            </a>
            <a
              className="nav-btn waze"
              href={wazeUrl(info.stadium.coords)}
              target="_blank"
              rel="noopener noreferrer"
            >
              🚗 Waze
            </a>
          </div>
        </div>

        {/* FAN ZONE */}
        <div className="sec-title">Moroccan Fan Zone</div>
        <div className="fanzone">
          <div className="fz-banner">
            <span className="stars">★ ★ ★</span>
            <b>{info.fanZone.name}</b>
          </div>
          <div className="fz-body">
            <div className="fz-row">
              <span className="i">📍</span>
              <b>{info.fanZone.place}</b>
            </div>
            <div className="fz-row">
              <span className="i">🕒</span>
              {info.fanZone.opens}
            </div>
            <div className="fz-row">
              <span className="i">🥁</span>
              {info.fanZone.note}
            </div>
            <a
              className="nav-btn maps full"
              href={googleMapsUrl(info.fanZone.coords, info.fanZone.place)}
              target="_blank"
              rel="noopener noreferrer"
            >
              🗺️ Directions to the fan zone
            </a>
          </div>
        </div>

        <div className="madeby">
          Built with ❤️ for Moroccan fans · by Saïd{" "}
          <a
            href="https://www.instagram.com/ai.in.prod/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ai.in.prod
          </a>
        </div>
      </main>

      {/* TAB BAR */}
      <nav className="tabbar">
        <button className="tab active">
          <span className="ti">🏠</span>Home
        </button>
        <button className="tab">
          <span className="ti">⚽</span>Matches
        </button>
        <button className="tab">
          <span className="ti">🗺️</span>Nearby
        </button>
        <button className="tab">
          <span className="ti">🔔</span>Alerts
        </button>
      </nav>
    </div>
  );
}
