// Save as:  app/onboarding/page.jsx
// After sign-up, users land here, tell us about their restaurant, then enter the dashboard.
'use client';

import React, { useEffect, useState } from "react";

const T = {
  bg: "#0B0B0D", surface: "#141419", raised: "#1A1A21",
  border: "rgba(255,255,255,0.07)", borderStrong: "rgba(255,255,255,0.13)",
  text: "#F2F1EC", sub: "#9C9BA3", muted: "#5F5E66",
  gold: "#D9A441", goldSoft: "rgba(217,164,65,0.12)",
};

const SERVICES = ["Website", "Social Posts", "Media Buying", "Delivery App Management", "Email & SMS"];

const inputStyle = {
  width: "100%", background: T.raised, border: `1px solid ${T.border}`, borderRadius: 9,
  padding: "11px 13px", color: T.text, fontFamily: "Inter, sans-serif", fontSize: 14, outline: "none",
  boxSizing: "border-box",
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", owner: "", phone: "", address: "", services: [] });

  // If they already onboarded, skip straight to the dashboard
  useEffect(() => {
    fetch("/api/business").then((r) => { if (r.ok) window.location.href = "/"; }).catch(() => {});
  }, []);

  const toggleService = (s) =>
    setF((p) => ({ ...p, services: p.services.includes(s) ? p.services.filter((x) => x !== s) : [...p.services, s] }));

  const submit = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      window.location.href = "/";
    } catch {
      setError("Couldn't save — try again.");
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Inter, sans-serif", display: "grid", placeItems: "center", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: 460 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: T.gold, display: "grid", placeItems: "center", color: "#141419", fontWeight: 800, fontFamily: "'Instrument Serif', serif", fontSize: 21, fontStyle: "italic" }}>F</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Fortuneful</span>
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: T.muted, fontFamily: "monospace" }}>Step {step} of 2</span>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "26px 24px" }}>
          {step === 1 ? (
            <>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 26, margin: "0 0 4px" }}>
                Tell us about your restaurant.
              </h1>
              <p style={{ color: T.sub, fontSize: 13.5, margin: "0 0 20px" }}>Two minutes, and your dashboard is ready.</p>

              <label style={{ display: "block", marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.sub, marginBottom: 6 }}>Restaurant name</div>
                <input style={inputStyle} placeholder="e.g. Chung Fa" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              </label>
              <label style={{ display: "block", marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.sub, marginBottom: 6 }}>Your name</div>
                <input style={inputStyle} value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })} />
              </label>
              <label style={{ display: "block", marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.sub, marginBottom: 6 }}>Phone</div>
                <input style={inputStyle} placeholder="(___) ___-____" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              </label>
              <label style={{ display: "block", marginBottom: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.sub, marginBottom: 6 }}>Address</div>
                <input style={inputStyle} placeholder="Street, city, state" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
              </label>

              <button
                onClick={() => f.name && f.owner && setStep(2)}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: T.gold, color: "#141419", fontWeight: 700, fontSize: 14.5, fontFamily: "Inter, sans-serif",
                  opacity: f.name && f.owner ? 1 : 0.5,
                }}>
                Continue
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: 26, margin: "0 0 4px" }}>
                What should we handle first?
              </h1>
              <p style={{ color: T.sub, fontSize: 13.5, margin: "0 0 20px" }}>Pick what you're interested in — you can request anything later.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {SERVICES.map((s) => {
                  const on = f.services.includes(s);
                  return (
                    <button key={s} onClick={() => toggleService(s)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                      border: `1px solid ${on ? T.gold : T.border}`,
                      background: on ? T.goldSoft : T.raised,
                      color: on ? T.gold : T.text, fontWeight: 600, fontSize: 13.5, fontFamily: "Inter, sans-serif",
                    }}>
                      {s}
                      <span style={{ fontSize: 16 }}>{on ? "✓" : "+"}</span>
                    </button>
                  );
                })}
              </div>

              {error && <p style={{ color: "#F87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{
                  padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${T.borderStrong}`, background: "transparent",
                  color: T.text, fontWeight: 600, fontSize: 14, fontFamily: "Inter, sans-serif",
                }}>Back</button>
                <button onClick={submit} disabled={saving} style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: T.gold, color: "#141419", fontWeight: 700, fontSize: 14.5, fontFamily: "Inter, sans-serif",
                  opacity: saving ? 0.6 : 1,
                }}>
                  {saving ? "Setting up…" : "Enter my dashboard"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
