"use strict";
const { db, HashTableName } = require("./db");
const spider = require("./spide");
const checkMathod = require("./checkMethod");

let _proxyArray = [];

async function loop() {
    try {
        let r = await spider.spideData5u();
        console.log(r);
        let proxys = await db.HKEYS(HashTableName);
        // sync check ip & kill dead ip
        for (let i = 0; i < proxys.length; i++) {
            await check(proxys[i]);
        }
        _proxyArray = await db.HKEYS(HashTableName);
        console.log("update finished");
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(loop, 60000);
    }
}

async function check(p) {
    for (let i = 0; i < checkMathod.length; i++) {
        if (!await checkMathod[i](p)) {
            db.HDEL(HashTableName, p);
            return false;
        }
    }

    return true;
}

setTimeout(async () => {
    _proxyArray = await db.HKEYS(HashTableName);
    await loop();
}, 100);

// setInterval(loop, 60000);

module.exports = {
    index: async ctx => {
        ctx.body = "ok";
    },
    getAll: async ctx => {
        ctx.body = _proxyArray;
    },
    getOne: async ctx => {
        ctx.body = _proxyArray[~~(Math.random() * _proxyArray.length)];
    }
};
