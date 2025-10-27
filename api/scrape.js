const puppeteer = require('puppeteer');

(async () => {
    const browser = await pupeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://dav-karlsbad.de');

    const text = await page.$eval('.percent-value', el => el.textContent);
    
    //Element in json erzeugen
    ...
    console.log(text);

    await.browser.close();
})();

 
