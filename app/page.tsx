"use client";

import { useMemo, useState } from "react";
import { CITIES, MATCHES, nextMatch, type City } from "@/lib/data";
import Countdown from "./Countdown";
import SignupForm from "./SignupForm";

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
  const match = nextMatch() ?? MATCHES[0];
  const [city, setCity] = useState<City>(match.city);
  const info = CITIES[city];

  const localTime = useMemo(() => fmtTime(match.kickoff), [match.kickoff]);
  const moroccoTime = useMemo(
    () => fmtTime(match.kickoff, MOROCCO_TZ),
    [match.kickoff]
  );

  return (
    <div className="app">
      {/* HERO */}
      <header className="hero">
        <div className="brandrow">
          <div className="star">⭐</div>
          <div className="brand">
            Atlas Hub
            <small>Morocco · World Cup 2026</small>
          </div>
          <div className="live">
            <span className="dot" />
            LIVE
          </div>
        </div>

        <div className="matchcard">
          <div className="mc-top">
            <span>Next Match</span>
            <span className="grp">{match.group}</span>
          </div>
          <div className="teams">
            <div className="team">
              <div className="flag">🇲🇦</div>
              <b>Morocco</b>
            </div>
            <div className="vs">VS</div>
            <div className="team">
              <div className="flag">{match.opponentFlag}</div>
              <b>{match.opponent}</b>
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

        {/* CITY SELECTOR */}
        <div className="sec-title">Your Host City</div>
        <div className="cities">
          {Object.values(CITIES).map((c) => (
            <button
              key={c.id}
              className={`chip ${c.id === city ? "active" : ""}`}
              onClick={() => setCity(c.id)}
            >
              <span className="f">{c.flag}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* ESSENTIALS */}
        <div className="sec-title">Essentials Near You</div>
        <div className="grid">
          <div className="tile">
            <span className="em">🕌</span>
            <span className="tag">{info.mosques} near</span>
            <h4>Mosques</h4>
            <p>Prayer times &amp; nearest masjid to the stadium</p>
          </div>
          <div className="tile">
            <span className="em">🥙</span>
            <span className="tag">{info.halal} spots</span>
            <h4>Halal Food</h4>
            <p>Verified halal restaurants &amp; groceries</p>
          </div>
          <div className="tile wide">
            <span className="em">🚇</span>
            <div>
              <h4>Get to the Stadium</h4>
              <p>Route, timing &amp; the buy-ahead trap</p>
            </div>
          </div>
        </div>

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
          </div>
        </div>

        <div className="madeby">
          Built with ❤️ for Moroccan fans · by <b>@said</b>
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
