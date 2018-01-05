"use strict";

const Koa = require("koa");
const app = new Koa();
const router = require("koa-router")();
const bodyParser = require("koa-bodyparser");
const cors = require("kcors");

const controller = require("./controller");

app.use(cors());
app.use(bodyParser());

// app.use(async (ctx, next) => {
//     try {
//         await next();
//     } catch (err) {
//         ctx.status = 500;
//         ctx.body = {
//             code: -1,
//             error: err
//         };
//     }
// });

router
    //    .get('/token/:tokenType', controller.getToken)
    .get("/all", controller.getAll)
    .get("/", controller.getOne);

app.use(router.routes());

app.listen(3000);
