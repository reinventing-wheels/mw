import { IncomingMessage, ServerResponse } from 'http'

export class Context {
  readonly base = '/' as string
  readonly path = decodeURI(this.req.url!)

  constructor(readonly req: IncomingMessage, readonly res: ServerResponse) {}
}
