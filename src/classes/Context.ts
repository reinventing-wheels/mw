import { IncomingMessage, ServerResponse } from 'http'
import { UrlWithParsedQuery, parse } from 'url'
import { Has } from '../types'

export class Context {
  readonly url: Has<UrlWithParsedQuery, 'href' | 'path' | 'pathname'>
  readonly path: string
  readonly base: string

  constructor(readonly req: IncomingMessage, readonly res: ServerResponse) {
    this.url = parse(decodeURI(req.url!), true) as Required<UrlWithParsedQuery>
    this.path = this.url.pathname
    this.base = '/'
  }
}
