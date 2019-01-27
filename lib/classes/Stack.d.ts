import { Context } from './Context';
import { ContextConstructor, Middleware } from '../types';
import { RequestHandler } from '../types';
export declare class Stack<C extends Context> {
    readonly handler: RequestHandler;
    readonly mws: Middleware<C>[];
    readonly mw: Middleware<C>;
    constructor(Context: ContextConstructor<C>);
    push(mw: Middleware<C> | Stack<C>): this;
    push(path: string, mw: Middleware<C> | Stack<C>): this;
}
