"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chain = (proto, ...extensions) => Object.assign(Object.create(proto), ...extensions);
const unwrap = (mwOrApp) => mwOrApp instanceof App ? mwOrApp.mw : mwOrApp;
const ifMatches = (path) => mw => (ctx, next) => ctx.path.startsWith(path) ? mw(ctx, next) : next();
const inBase = (base) => mw => (ctx, next) => mw(chain(ctx, { base, path: ctx.path.slice(base.length) }), next);
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
        this.mws.push(unwrap(mwOrApp));
        return this;
    }
    mount(path, mwOrApp) {
        const base = path.endsWith('/') && path.slice(0, -1);
        const mw = unwrap(mwOrApp);
        this.mws.push(ifMatches(path)(base ? inBase(base)(mw) : mw));
        return this;
    }
}
exports.App = App;
