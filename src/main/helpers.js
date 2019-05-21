const lighthouse = require('lighthouse');
const fs = require('fs');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');


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
        fs.mkdirSync(dirName, '0766');
    }
}

async function getLighthouseResult(lhr, property) {
    const jsonProperty = new Map()
        .set('performance', await lhr.lhr.categories.performance.score * 100)
        .set('pageSpeed', await lhr.lhr.audits["speed-index"].score * 100);


    let result = await jsonProperty.get(property);
    return result
}

module.exports = {
    gatherLightHouseMetrics,
    createDir,
    generateReport,
    getLighthouseResult,
};

