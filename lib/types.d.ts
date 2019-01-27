/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Context } from './classes/Context';
export declare type Has<T, K extends keyof T> = T & Required<Pick<T, K>>;
export declare type ContextConstructor<C extends Context> = new (req: IncomingMessage, res: ServerResponse) => C;
export declare type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export declare type MiddlewareWrapper = <C extends Context>(mw: Middleware<C>) => Middleware<C>;
export declare type MiddlewareJoiner = <C extends Context>(mws: Middleware<C>[]) => Middleware<C>;
export declare type Middleware<C extends Context> = (ctx: C, next: Next) => Promise<void>;
export declare type Next = () => Promise<void>;
