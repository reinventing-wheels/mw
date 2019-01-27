import { Context } from './Context'
import { ContextConstructor, Middleware, Next } from '../types'
import { RequestHandler, MiddlewareWrapper, MiddlewareJoiner } from '../types'

const chain = (proto: object, ...extensions: object[]) =>
  Object.assign(Object.create(proto), ...extensions)

const unwrap = <C extends Context>(arg: Middleware<C> | Stack<C>) =>
  arg instanceof Stack ? arg.mw : arg

const ifMatches = (path: string): MiddlewareWrapper => mw => (ctx, next) =>
  ctx.path.startsWith(path) ? mw(ctx, next) : next()

const inBase = (base: string): MiddlewareWrapper => mw => (ctx, next) =>
  mw(chain(ctx, { base, path: ctx.path.slice(base.length) }), next)

const mount = (path: string): MiddlewareWrapper => {
  const base = path.endsWith('/') && path.slice(0, -1)
  return mw => ifMatches(path)(base ? inBase(base)(mw) : mw)
}

const join: MiddlewareJoiner = mws => (ctx, last) => {
  let mw, i = 0
  const next: Next = () => (mw = mws[i++]) ? mw(ctx, next) : last()
  return next()
}

export class Stack<C extends Context> {
  readonly handler: RequestHandler
  readonly mws: Middleware<C>[] = []
  readonly mw: Middleware<C> = join(this.mws)

  constructor(Context: ContextConstructor<C>) {
    const reject = () => Promise.reject(new Error)
    this.handler = (req, res) => this.mw(new Context(req, res), reject)
  }

  push(mw: Middleware<C> | Stack<C>): this
  push(path: string, mw: Middleware<C> | Stack<C>): this
  push(arg1: any, arg2?: any) {
    this.mws.push(arg2 ? mount(arg1)(unwrap(arg2)) : unwrap(arg1))
    return this
  }
}
