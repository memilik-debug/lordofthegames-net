// Köy Savunma — Online Liderlik Tablosu (Netlify Functions + Netlify Blobs)
// Tüm cihazlardan ortak skor listesi tutar.
import { getStore } from "@netlify/blobs";

const GAME_KEY = "koy-savunma-scores";
const TOP_LIMIT = 50; // 50 skor tutuyoruz, frontend top 10 gösterir

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function sanitizeEntry(raw) {
  if (!raw || typeof raw !== "object") return null;
  let name = String(raw.name || "").trim().slice(0, 16) || "Anonim";
  // Basit küfür/uzun isim filtresi
  name = name.replace(/[<>]/g, "");
  const score = Math.max(0, Math.min(99999999, Math.floor(Number(raw.score) || 0)));
  const diff = ["easy", "mid", "hard"].includes(raw.diff) ? raw.diff : "mid";
  if (score < 1) return null;
  return {
    name,
    score,
    diff,
    date: new Date().toLocaleDateString("tr-TR"),
    ts: Date.now(),
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
  };
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let store;
  try {
    store = getStore(GAME_KEY);
  } catch (e) {
    return new Response(JSON.stringify({ error: "store_unavailable", detail: String(e) }), {
      status: 500, headers: corsHeaders,
    });
  }

  try {
    if (req.method === "GET") {
      const list = (await store.get("top", { type: "json" })) || [];
      // En yüksek skorlu 10 tanesini döndür
      const sorted = list.slice().sort((a, b) => b.score - a.score).slice(0, 10);
      return new Response(JSON.stringify({ ok: true, scores: sorted }), {
        status: 200, headers: corsHeaders,
      });
    }

    if (req.method === "POST") {
      let body;
      try { body = await req.json(); }
      catch (e) {
        return new Response(JSON.stringify({ error: "invalid_json" }), {
          status: 400, headers: corsHeaders,
        });
      }
      const entry = sanitizeEntry(body);
      if (!entry) {
        return new Response(JSON.stringify({ error: "invalid_entry" }), {
          status: 400, headers: corsHeaders,
        });
      }
      const existing = (await store.get("top", { type: "json" })) || [];
      existing.push(entry);
      existing.sort((a, b) => b.score - a.score);
      const top = existing.slice(0, TOP_LIMIT);
      await store.setJSON("top", top);
      const top10 = top.slice(0, 10);
      const rank = top.findIndex(s => s.id === entry.id) + 1;
      return new Response(JSON.stringify({ ok: true, scores: top10, rank, entry }), {
        status: 200, headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405, headers: corsHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "server_error", detail: String(e) }), {
      status: 500, headers: corsHeaders,
    });
  }
};

export const config = {
  path: "/api/leaderboard",
};
