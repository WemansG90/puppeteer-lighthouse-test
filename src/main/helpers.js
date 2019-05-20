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

function generateReport(json){
    return ReportGenerator.generateReportHtml(json);
}

async function createDir(dirName) {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, '0766');
    }
}

module.exports = {
    gatherLightHouseMetrics,
    createDir,
    generateReport
};

