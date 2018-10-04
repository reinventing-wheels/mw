/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export declare class Context {
    readonly req: IncomingMessage;
    readonly res: ServerResponse;
    readonly base: string;
    readonly path: string;
    constructor(req: IncomingMessage, res: ServerResponse);
}
