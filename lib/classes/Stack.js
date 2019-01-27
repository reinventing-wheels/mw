"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chain = (proto, ...extensions) => Object.assign(Object.create(proto), ...extensions);
const unwrap = (arg) => arg instanceof Stack ? arg.mw : arg;
const ifMatches = (path) => mw => (ctx, next) => ctx.path.startsWith(path) ? mw(ctx, next) : next();
const inBase = (base) => mw => (ctx, next) => mw(chain(ctx, { base, path: ctx.path.slice(base.length) }), next);
const mount = (path) => {
    const base = path.endsWith('/') && path.slice(0, -1);
    return mw => ifMatches(path)(base ? inBase(base)(mw) : mw);
};
const join = mws => (ctx, last) => {
    let mw, i = 0;
    const next = () => (mw = mws[i++]) ? mw(ctx, next) : last();
    return next();
};
class Stack {
    constructor(Context) {
        this.mws = [];
        this.mw = join(this.mws);
        const reject = () => Promise.reject(new Error);
        this.handler = (req, res) => this.mw(new Context(req, res), reject);
    }
    push(arg1, arg2) {
        this.mws.push(arg2 ? mount(arg1)(unwrap(arg2)) : unwrap(arg1));
        return this;
    }
}
exports.Stack = Stack;
