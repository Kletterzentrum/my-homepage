const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/percent", async (req, res) => {
  try {
    const response = await axios.get("https://dav-karlsbad.de");
    const dom = new JSDOM(response.data);
    const percentEl = dom.window.document.getElementsByClassName("percent-value")[0];

    if (percentEl) {
      res.json({ percent: percentEl.textContent.trim() });
    } else {
      res.status(404).json({ error: "Element nicht gefunden" });
    }
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy läuft auf Port ${PORT}`);
});
