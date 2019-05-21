const lighthouse = require('lighthouse');
const fs = require('fs');
const config = require('../config/custom_config.js');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

let {DateTime} = require('luxon');
const timeStamp = DateTime.local().toFormat('yyyymmdd_HHmmss');

async function gatherLightHouseMetrics(page, config) {
    const port = await page.browser().wsEndpoint().split(':')[2].split('/')[0];
    return await lighthouse(page.url(), {port: port}, config).then(results => {
        delete results.artifacts;
        return results
    });
}

function generateReport(results) {
    return ReportGenerator.generateReportHtml(results);
}

async function createDir(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName,{recursive:true , mode:502});
    }
}

async function getLighthouseResult(lhr, property) {
    try {
        const jsonProperty = new Map()
            .set('performance', await lhr.lhr.categories.performance.score * 100)
            .set('pageSpeed', await lhr.lhr.audits["speed-index"].score * 100);

        return await jsonProperty.get(property);
    } catch (e) {
        console.log(e);
    }
}

async function reportWriter(resultsDir, pageName, metrics) {
    try {
        await createDir(resultsDir);
        const path = `./${resultsDir}/${pageName}_${timeStamp}`;
        fs.writeFileSync(`${path}.json`,
            JSON.stringify(metrics, null, 2));
        const html = generateReport(metrics.lhr);
        fs.writeFileSync(`${path}.html`, html);
        return path;
    } catch (e) {
        console.log(e);
    }
}

async function verify(page) {
    return await gatherLightHouseMetrics(page, config);
}

module.exports = {
    verify,
    getLighthouseResult,
    reportWriter
};

