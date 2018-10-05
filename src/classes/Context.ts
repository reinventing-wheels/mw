import { IncomingMessage, ServerResponse } from 'http'
import { UrlWithParsedQuery, parse } from 'url'
import { Has } from '../types'

export class Context {
  readonly url = parse(decodeURI(this.req.url!), true) as Has<UrlWithParsedQuery, 'pathname' | 'path' | 'href'>
  readonly path = this.url.pathname
  readonly base = '/' as string

  constructor(readonly req: IncomingMessage, readonly res: ServerResponse) {}
}
