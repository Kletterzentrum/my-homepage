const puppeteer = require('puppeteer');

module.exports = async(req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://dav-karlsbad.de');
    const text = await page.$eval('.percent-value', el => el.textContent);
    await browser.close();

    res.status(200).json({result: text});
};

 
