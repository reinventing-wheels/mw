import { ContextConstructor, RequestHandler, MiddlewareWrapper, Middleware, Next } from '../types'
import { Context } from './Context'

const unpack = <C extends Context>(mwOrApp: Middleware<C> | App<C>) =>
  mwOrApp instanceof App ? mwOrApp.mw : mwOrApp

const ifMatches = (path: string): MiddlewareWrapper => mw => (ctx, next) =>
  ctx.path.startsWith(path) ? mw(ctx, next) : next()

const inBase = (base: string): MiddlewareWrapper => mw => (ctx, next) => {
  const ctxʹ = Object.create(ctx)
  ctxʹ.base = base
  ctxʹ.path = ctx.path.slice(base.length - 1)
  return mw(ctxʹ, next)
}

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
    this.mws.push(unpack(mwOrApp))
    return this
  }

  mount(path: string, mwOrApp: Middleware<C> | App<C>) {
    const mw = unpack(mwOrApp)
    this.mws.push(ifMatches(path)(path.endsWith('/') ? inBase(path)(mw) : mw))
    return this
  }
}
