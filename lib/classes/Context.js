"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
class Context {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.url = url_1.parse(decodeURI(this.req.url), true);
        this.path = this.url.pathname;
        this.base = '/';
    }
}
exports.Context = Context;
