// scripts/update-mitglieder.js
import fs from "fs";

async function loadPage(){
  const response = await fetch("https://dav-karlsbad.de");
  const htmlContent = await response.text();
  const page = htmlContent;
}

loadPage();

/*
async function updateMitglieder() {
  try {
    const url = "https://dav-karlsbad.de";
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();

    // Versuch: Zahl aus Element mit Klasse percent-value extrahieren
    // (passt zu deinem Snippet: <span class="percent-value">1234</span>)
    const match = html.match(/class=["']percent-value["'][^>]*>([^<]+)<\/\w+>/i);
    const mitglieder = match ? match[1].trim() : null;

    const data = {
      mitglieder: mitglieder ?? "1716",
      stand: new Date().toISOString(),
      source: url
    };
*/

document.body.innerHTML = page;
const element = document.getElementsByClassName('percent-value')[0];
const text = element.innerText;

    const data = {
      mitglieder: mitglieder ?? text,
      stand: new Date().toISOString(),
      source: url
    };

    // Stelle sicher, dass data-Ordner existiert
    if (!fs.existsSync("data")) fs.mkdirSync("data");

    fs.writeFileSync("data/mitgliedszahl.json", JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log("Mitgliedszahl aktualisiert:", data.mitglieder);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Mitgliedszahl:", err);
    // Schreibe Fehlerstatus in JSON, damit Frontend nicht komplett scheitert
    const data = {
      mitglieder: "XXX",
      stand: new Date().toISOString(),
      error: String(err)
    };
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    fs.writeFileSync("data/mitgliedszahl.json", JSON.stringify(data, null, 2) + "\n", "utf8");
    process.exit(1);
  }
}

updateMitglieder();
