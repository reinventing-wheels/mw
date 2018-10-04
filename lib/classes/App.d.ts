import { ContextConstructor, RequestHandler, Middleware } from '../types';
import { Context } from './Context';
export declare class App<C extends Context> {
    readonly handler: RequestHandler;
    readonly mws: Middleware<C>[];
    readonly mw: Middleware<C>;
    constructor(Context: ContextConstructor<C>);
    use(mwOrApp: Middleware<C> | App<C>): this;
    mount(path: string, mwOrApp: Middleware<C> | App<C>): this;
}
