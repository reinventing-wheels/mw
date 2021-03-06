import { IncomingMessage, ServerResponse } from 'http'
import { Context } from './classes/Context'

export type Has<T, K extends keyof T> =
  T & Required<Pick<T, K>>

export type ContextConstructor<C extends Context> =
  new (req: IncomingMessage, res: ServerResponse) => C

export type RequestHandler =
  (req: IncomingMessage, res: ServerResponse) => Promise<void>

export type MiddlewareWrapper =
  <C extends Context>(mw: Middleware<C>) => Middleware<C>

export type MiddlewareJoiner =
  <C extends Context>(mws: Middleware<C>[]) => Middleware<C>

export type Middleware<C extends Context> =
  (ctx: C, next: Next) => Promise<void>

export type Next =
  () => Promise<void>
