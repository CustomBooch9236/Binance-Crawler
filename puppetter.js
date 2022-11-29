const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.telegraph.co.uk/markets-hub/assets/shares/");
            let urls = await page.evaluate(() => {
                let results = [];
                const date = new Date();
                let items = document.querySelectorAll("tr");
                items.forEach((item) => {
                    results.push({
                        company: item.getAttribute('a.ng-binding'),
                        shareprice:  item.getAttribute('td.ng-binding'),
                        turnover: item.getAttribute('td.hidden-xs ng-binding'),
                        time: date,
                    });
                });
                return results;
            })

            const csvWriter = createCsvWriter({
                header: ['companyName', 'sharePrice', 'turnover', 'date'],
                path: 'file.csv',
            });

            csvWriter.writeRecords(urls)
                .then(() => {
                    console.log('...Done');
                });

            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

run().then(console.log).catch(console.error);




