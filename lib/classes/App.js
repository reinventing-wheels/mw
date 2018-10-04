"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unpack = (mwOrApp) => mwOrApp instanceof App ? mwOrApp.mw : mwOrApp;
const ifMatches = (path) => mw => (ctx, next) => ctx.path.startsWith(path) ? mw(ctx, next) : next();
const inBase = (base) => mw => (ctx, next) => mw(Object.assign(Object.create(ctx), { base, path: ctx.path.slice(base.length) }), next);
class App {
    constructor(Context) {
        this.mws = [];
        this.mw = (ctx, last) => {
            let mw, i = 0;
            const next = () => (mw = this.mws[i++]) ? mw(ctx, next) : last();
            return next();
        };
        const reject = () => Promise.reject(new Error);
        this.handler = (req, res) => this.mw(new Context(req, res), reject);
    }
    use(mwOrApp) {
        this.mws.push(unpack(mwOrApp));
        return this;
    }
    mount(path, mwOrApp) {
        const base = path.endsWith('/') && path.slice(0, -1);
        const mw = unpack(mwOrApp);
        this.mws.push(ifMatches(path)(base ? inBase(base)(mw) : mw));
        return this;
    }
}
exports.App = App;
