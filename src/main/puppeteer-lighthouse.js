const puppeteer = require('puppeteer');
const config = require('../config/custom_config.js');
const fs = require('fs');
const resultsDir = 'results';
const helpers = require('./helpers');
let {DateTime} = require('luxon');

const timeStamp = DateTime.local().toFormat('yyyymmdd_HHmmss');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            // slowMo: 250,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
        });
        const page = await browser.newPage();
        await page.setViewport({width:1920,height:1080});
        await page.goto('https://www.delijn.be');

        await Promise.all([
            page.click('button#btn-my-account-login'),
            page.waitForNavigation({'waituntil': 'load'})
        ]);
        await verify(page, 'loginPage');
        await browser.close();
    } catch (e) {
        console.log(e);
    }

})();

async function verify(page, pageName) {
    await helpers.createDir(resultsDir);
    const metrics = await helpers.gatherLightHouseMetrics(page, config);
    const path = `./${resultsDir}/${pageName}_${timeStamp}`
    fs.writeFileSync(`${path}.json`,
        JSON.stringify(metrics, null, 2));
    // const html = helpers.generateReport(`${path}.json`);
    // fs.writeFileSync(`${path}.html`,html);
    return metrics;
}
