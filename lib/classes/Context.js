"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const parsePath = (path) => url_1.parse(decodeURI(path), true);
class Context {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.url = parsePath(this.req.url);
        this.path = this.url.pathname;
        this.base = '/';
    }
}
exports.Context = Context;
