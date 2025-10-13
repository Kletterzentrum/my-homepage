// update_members.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  try {
    const url = 'https://dav-karlsbad.de/';
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'DAV-Members-Sync/1.0 (+https://github.com/Kletterzentrum/my-homepage)' },
      timeout: 15000
    });

    const $ = cheerio.load(res.data);
    const bodyText = $('body').text();
    const match = bodyText.match(/Aktuelle\s*Mitgliederzahl\s*der\s*Sektion:\s*(\d+)/i);
    const number = match ? parseInt(match[1], 10) : null;

    if (!number) throw new Error('Mitgliederzahl nicht gefunden');

    const data = {
      members: number,
      updated: new Date().toISOString()
    };

    fs.writeFileSync('members.json', JSON.stringify(data, null, 2));
    console.log('Mitgliederzahl aktualisiert:', data);
  } catch (err) {
    console.error('Fehler:', err.message);
    process.exit(1);
  }
})();
