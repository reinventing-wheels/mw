"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.base = '/';
        this.path = decodeURI(this.req.url);
    }
}
exports.Context = Context;
