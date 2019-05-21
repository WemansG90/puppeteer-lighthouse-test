const describe = require('mocha').describe;
const expect = require('chai').expect;
const helpers = require('../utils/helpers');
const puppeteer = require('puppeteer');

describe('Janrain widget speed', function() {

    const pageName = 'loginPage';
    let results;

    beforeEach(async function() {
        this.enableTimeouts(false);
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
            results = await helpers.verify(page);
            await browser.close();
        } catch (e) {
            console.log(e);
        }
    });

    afterEach(async function () {
        if (this.currentTest.state == 'passed') {
            try {
                await helpers.reportWriter('results/passed', pageName, results);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
               await helpers.reportWriter('results/failed', pageName, results);
            } catch (e) {
                console.log(e);
            }
        }
    });

    it('Should be above 75 lighthouse pagespeed score', async function () {
        const performance = await helpers.getLighthouseResult(results, 'performance');
        expect(performance).to.be.above(75);
    })
});