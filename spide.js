const puppeteer = require("puppeteer");
const { db, HashTableName } = require("./db");

const __ = "OK";

module.exports = {
    spideData5u: async function() {
        try {
            let browser = await puppeteer.launch({
                // executablePath:
                // "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                // update this to your local chromium path
                executablePath:
                    "/Applications/Chromium.app/Contents/MacOS/Chromium",
                headless: true
            });
            const page = await browser.newPage();

            await page.goto("http://www.data5u.com/");

            let scripts = function() {
                let li = document.querySelectorAll(".l2");
                // >span:nth-child(-n+2)>li

                let protocol = Array.from(li).map(
                    list =>
                        list
                            .querySelector("span:nth-child(4)>li")
                            .innerText.split(",")[0]
                );

                return Array.from(li).map(
                    (list, i) =>
                        protocol[i] +
                        "://" +
                        Array.from(
                            list.querySelectorAll("span:nth-child(-n+2)>li")
                        )
                            .map(m => m.innerText)
                            .join(":")
                );
            };

            let list = await page.evaluate(scripts);

            await browser.close();

            list.forEach(async p => {
                await db.HSET(HashTableName, p, __);
            });
        } catch (error) {
            console.error("spideData5u error ", error);
        }
    }
};

// (async () => {
//     let r = await module.exports.spideData5u();
//     console.log(r);
// })();
