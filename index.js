import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const app = express();
app.use(cors());

const SOURCE_URL = process.env.SOURCE_URL || "https://dav-karlsbad.de";
const PORT = process.env.PORT || 3000;
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 30000);

let cache = { value: null, ts: 0 };

async function fetchPercentValue() {
  const now = Date.now();
  if (cache.value && now - cache.ts < CACHE_TTL_MS) return cache.value;

  const res = await fetch(SOURCE_URL, {
    timeout: 10000,
    headers: { "User-Agent": "percent-proxy/1.0 (+https://github.com/YOURNAME)" }
  });
  if (!res.ok) throw new Error(`Source returned ${res.status}`);
  const html = await res.text();

  const dom = new JSDOM(html);
  const el = dom.window.document.querySelector(".percent-value");
  const text = el ? el.textContent.trim() : null;

  cache = { value: text, ts: Date.now() };
  return text;
}

app.get("/api/percent", async (req, res) => {
  try {
    const value = await fetchPercentValue();
    if (!value) return res.status(404).json({ ok: false, message: "Element not found" });
    res.json({ ok: true, value });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ percent-proxy läuft auf http://localhost:${PORT}`);
});

