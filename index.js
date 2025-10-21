// index.js
import express from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();
app.use(cors());

const SOURCE_URL = process.env.SOURCE_URL || "https://dav-karlsbad.de";
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 30_000);
const PORT = process.env.PORT || 3000;

let cache = { value: null, ts: 0 };

async function fetchPercentValue() {
  const now = Date.now();
  if (cache.value && now - cache.ts < CACHE_TTL_MS) {
    return cache.value;
  }

  const res = await fetch(SOURCE_URL, { timeout: 10000, headers: { "User-Agent": "percent-proxy/1.0 (+your-email@example.com)" } });
  if (!res.ok) throw new Error(`Source returned ${res.status}`);
  const html = await res.text();
  const dom = new JSDOM(html);
  const el = dom.window.document.getElementsByClassName("percent-value")[0];
  const text = el ? el.textContent.trim() : null;

  cache = { value: text, ts: Date.now() };
  return text;
}

app.get("/api/percent", async (req, res) => {
  try {
    const value = await fetchPercentValue();
    if (value === null) {
      return res.status(404).json({ ok: false, message: "Element not found" });
    }
    res.json({ ok: true, value });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ ok: false, message: "Error fetching source", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://0.0.0.0:${PORT} (source: ${SOURCE_URL})`);
});
