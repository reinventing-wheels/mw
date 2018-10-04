"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unpack = (mwOrApp) => mwOrApp instanceof App ? mwOrApp.mw : mwOrApp;
const ifMatches = (path) => mw => (ctx, next) => ctx.path.startsWith(path) ? mw(ctx, next) : next();
const inBase = (base) => mw => (ctx, next) => {
    const { base: baseʹ, path: pathʹ } = ctx, ctxʹ = ctx;
    ctxʹ.base = base;
    ctxʹ.path = pathʹ.slice(base.length - 1);
    return mw(ctx, () => (ctxʹ.base = baseʹ, ctxʹ.path = pathʹ, next()));
};
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
        const mw = unpack(mwOrApp);
        this.mws.push(ifMatches(path)(path.endsWith('/') ? inBase(path)(mw) : mw));
        return this;
    }
}
exports.App = App;
