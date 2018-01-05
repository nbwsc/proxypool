const request = require("request-promise");

const _Timeout = 5000;
const _DefalutHead = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
    "Proxy-Connection": "keep-alive"
};
const _OriginIP = "202.85.220.36";

module.exports = [
    async proxy => {
        try {
            let r = await request({
                url: "http://httpbin.org/ip",
                method: "GET",
                headers: _DefalutHead,
                timeout: _Timeout,
                proxy: proxy,
                json: true
            });
            return r.origin.includes(proxy.match(/\/\/(.+)\:/)[1]);
        } catch (error) {
            return false;
        }
    },
    async proxy => {
        try {
            let r = await request({
                url:
                    "http://server.baibaocp.com/web/syxwlist/lotid/10108/num/1",
                method: "GET",
                headers: _DefalutHead,
                timeout: _Timeout,
                proxy: proxy,
                json: true
            });
            if (r.ret === 0) return true;
        } catch (error) {
            return false;
        }
    }
];
