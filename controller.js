"use strict";
const { db, HashTableName } = require("./db");
const spider = require("./spide");
const checkMathod = require("./checkMethod");

// let _proxyArray = [];

async function loop() {
    console.log(new Date(), "starting loop");
    try {
        await spider.spide66ip();
        // console.log(r);
        let proxys = await db.HKEYS(HashTableName);
        // sync check ip & kill dead ip
        for (let i = 0; i < proxys.length; i++) {
            await check(proxys[i]);
        }
        // _proxyArray = await db.HKEYS(HashTableName);
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
            console.log("check fail", p);
            return false;
        }
    }
    console.log("check ok", p);
    return true;
}

setTimeout(async () => {
    // _proxyArray = await db.HKEYS(HashTableName);
    await loop();
}, 100);

// setInterval(loop, 60000);

module.exports = {
    index: async ctx => {
        ctx.body = "ok";
    },
    getAll: async ctx => {
        ctx.body = await db.HKEYS(HashTableName);
    },
    getOne: async ctx => {
        let proxys = await db.HKEYS(HashTableName);
        ctx.body = proxys[~~(Math.random() * proxys.length)];
    }
};
