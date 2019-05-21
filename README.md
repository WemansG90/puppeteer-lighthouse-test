# Lighthouse checks with Puppeteer and Mocha/Chai

The main goal of this repo is to test a login widget that is hidden behind a tokenized URL. Puppeteer handles getting to the widget then the Node Lighthouse library tests audits 

## Prerequisites 

* Node LTS
* Yarn

## Running the test

run `yarn install` and then `yarn test`

## Structure

The test returns the Lighthouse Json and HTML reports. The tests are sorted as followed:
* `results/passed/<PAGENAME>_<TIMESTAMP>`
* `results/failed/<PAGENAME>_<TIMESTAMP>`

The HTML can just be opened in a browser, the Json can be used for further processing