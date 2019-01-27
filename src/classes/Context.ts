import { IncomingMessage, ServerResponse } from 'http'
import { UrlWithParsedQuery, parse } from 'url'
import { Has } from '../types'

const parsePath = (path: string): Has<UrlWithParsedQuery, 'href' | 'path' | 'pathname'> =>
  parse(decodeURI(path), true) as Required<UrlWithParsedQuery>

export class Context {
  readonly url = parsePath(this.req.url!)
  readonly path = this.url.pathname
  readonly base = '/' as string

  constructor(readonly req: IncomingMessage, readonly res: ServerResponse) {}
}
