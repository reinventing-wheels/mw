import { ContextConstructor, RequestHandler, MiddlewareWrapper, Middleware, Next } from '../types'
import { Context } from './Context'

const chain = (proto: object, ...extensions: any[]) =>
  Object.assign(Object.create(proto), ...extensions)

const unwrap = <C extends Context>(mwOrApp: Middleware<C> | App<C>) =>
  mwOrApp instanceof App ? mwOrApp.mw : mwOrApp

const ifMatches = (path: string): MiddlewareWrapper => mw => (ctx, next) =>
  ctx.path.startsWith(path) ? mw(ctx, next) : next()

const inBase = (base: string): MiddlewareWrapper => mw => (ctx, next) =>
  mw(chain(ctx, { base, path: ctx.path.slice(base.length) }), next)

export class App<C extends Context> {
  readonly handler: RequestHandler
  readonly mws: Middleware<C>[] = []
  readonly mw: Middleware<C> = (ctx, last) => {
    let mw, i = 0
    const next: Next = () => (mw = this.mws[i++]) ? mw(ctx, next) : last()
    return next()
  }

  constructor(Context: ContextConstructor<C>) {
    const reject = () => Promise.reject(new Error)
    this.handler = (req, res) => this.mw(new Context(req, res), reject)
  }

  use(mwOrApp: Middleware<C> | App<C>) {
    this.mws.push(unwrap(mwOrApp))
    return this
  }

  mount(path: string, mwOrApp: Middleware<C> | App<C>) {
    const base = path.endsWith('/') && path.slice(0, -1)
    const mw = unwrap(mwOrApp)
    this.mws.push(ifMatches(path)(base ? inBase(base)(mw) : mw))
    return this
  }
}
