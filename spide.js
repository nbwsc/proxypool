const puppeteer = require("puppeteer");
const request = require("request-promise");
// const cheerio = require("cheerio");
const { db, HashTableName } = require("./db");

const __ = "OK";
const _POOL_LEN = 100;

async function insertDB(proxy, from) {
    let len = await db.HLEN(HashTableName);
    if (len <= _POOL_LEN) {
        await db.HSET(HashTableName, proxy, from);
    }
}

module.exports = {
    spideData5u: async function() {
        try {
            let browser = await puppeteer.launch({
                // executablePath:
                // "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                // update this to your local chromium path
                executablePath:
                    "/Applications/Chromium.app/Contents/MacOS/Chromium",
                // "/usr/bin/google-chrome",
                headless: false,
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
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
                await insertDB(p, "data5u");
            });
            return list;
        } catch (error) {
            console.error("spideData5u error ", error);
        }
    },
    spide66ip: async () => {
        let url =
            "http://www.66ip.cn/nmtq.php?getnum=100&isp=0&anonymoustype=0&start=&ports=&export=&ipaddress=&area=0&proxytype=0&api=66ip";
        let r = await request(url);
        let exp = "<br />";
        let proxys = r
            .split(exp)
            .map(item => "http://" + item.trim())
            .slice(1, 100);
        for (let i = 0; i < proxys.length; ++i) {
            await insertDB(proxys[i], "66ip");
        }

        return proxys;
    }
};

// (async () => {
//     let r = await module.exports.spide66ip();
//     console.log(r);
// })();
