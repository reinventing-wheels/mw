import { Server, ClientRequest, ClientRequestArgs, IncomingMessage } from 'http'
import { AddressInfo } from 'net'
import { Readable } from 'stream'
import { Stack, Context as BaseContext } from '.'

class Context extends BaseContext {
  send(data: any, code = 200) {
    return new Promise<void>(ok => {
      this.res.writeHead(code)
      this.res.end(data, ok)
    })
  }
}

const requester = (server: Server) => {
  const port = (server.address() as AddressInfo).port
  return (args?: ClientRequestArgs) => new Promise<IncomingMessage>(resolve => {
    new ClientRequest({ port, ...args }, res => resolve(res)).end()
  })
}

const read = async (stream: Readable) => {
  let result = ''
  for await (const chunk of stream as any)
    result += chunk
  return result
}

describe('basic', () => {
  const app = new Stack(Context)
    .push(ctx => ctx.send(ctx.path))

  const server = new Server(app.handler)
  beforeAll(() => new Promise(ok => server.listen(ok)))
  afterAll(() => new Promise(ok => server.close(ok)))

  it('should work as expected', async () => {
    const req = requester(server)
    expect(await read(await req({ path: '/foo' }))).toBe('/foo')
    expect(await read(await req({ path: '/bar' }))).toBe('/bar')
    expect(await read(await req())).toBe('/')
  })
})

describe('routes', () => {
  const app = new Stack(Context)
    .push('/bar', ctx => ctx.send('bar'))
    .push('/foo', ctx => ctx.send('foo'))
    .push('/', ctx => ctx.send('404'))

  const server = new Server(app.handler)
  beforeAll(() => new Promise(ok => server.listen(ok)))
  afterAll(() => new Promise(ok => server.close(ok)))

  it('should work as expected', async () => {
    const req = requester(server)
    expect(await read(await req({ path: '/bar' }))).toBe('bar')
    expect(await read(await req({ path: '/foo' }))).toBe('foo')
    expect(await read(await req())).toBe('404')
  })
})

describe('nested routes', () => {
  const bar = new Stack(Context)
    .push('/', ctx => ctx.send(`bar:${ctx.path}`))

  const foo = new Stack(Context)
    .push('/bar/', bar)
    .push('/', ctx => ctx.send(`foo:${ctx.path}`))

  const app = new Stack(Context)
    .push('/foo/', foo)
    .push('/', ctx => ctx.send(`app:${ctx.path}`))

  const server = new Server(app.handler)
  beforeAll(() => new Promise(ok => server.listen(ok)))
  afterAll(() => new Promise(ok => server.close(ok)))

  it('should work as expected', async () => {
    const req = requester(server)
    expect(await read(await req({ path: '/foo/bar/baz' }))).toBe('bar:/baz')
    expect(await read(await req({ path: '/foo/bar' }))).toBe('foo:/bar')
    expect(await read(await req({ path: '/foo' }))).toBe('app:/foo')
    expect(await read(await req())).toBe('app:/')
  })
})

describe('error handling', () => {
  const app = new Stack(Context)
    .push((ctx, next) => next().catch(e => ctx.send(e.stack, 500)))
    .push(() => Promise.reject(new Error(':^(')))

  const server = new Server(app.handler)
  beforeAll(() => new Promise(ok => server.listen(ok)))
  afterAll(() => new Promise(ok => server.close(ok)))

  it('should work as expected', async () => {
    const req = requester(server)
    const res = await req()
    expect(res.statusCode).toBe(500)
    expect(await read(res)).toContain('Error: :^(\n')
  })
})
