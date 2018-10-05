/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { UrlWithParsedQuery } from 'url';
import { Has } from '../types';
export declare class Context {
    readonly req: IncomingMessage;
    readonly res: ServerResponse;
    readonly url: Has<UrlWithParsedQuery, "path" | "pathname" | "href">;
    readonly path: string;
    readonly base: string;
    constructor(req: IncomingMessage, res: ServerResponse);
}
