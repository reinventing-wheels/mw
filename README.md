A small middleware framework in less than 100 lines of code

## Installation

```sh
yarn add reinventing-wheels/mw
```

## Usage

### Basics

```ts
import { Stack, Context } from 'mw'
import { Server } from 'http'

const app = new Stack(Context)

app.push(async (ctx, next) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`)
  await next()
})

app.push(async ctx => {
  ctx.res.end(`hello from ${ctx.path}`)
})

new Server(app.handler).listen(8080)
```

### Routes

```ts
import { Stack, Context } from 'mw'
import { Server } from 'http'

const app = new Stack(Context)

app.push('/doge', async ctx => {
  ctx.res.end('wow much doge')
})

app.push('/', async ctx => {
  ctx.res.end('wow such 404')
})

new Server(app.handler).listen(8080)
```

### Nested routes

```ts
import { Stack, Context } from 'mw'
import { Server } from 'http'

const bar = new Stack(Context)
  .push('/', async ctx => ctx.res.end('bar')) // /foo/bar/…

const foo = new Stack(Context)
  .push('/bar/', bar)
  .push('/', async ctx => ctx.res.end('foo')) // /foo/…

const app = new Stack(Context)
  .push('/foo/', foo)
  .push('/', async ctx => ctx.res.end('app')) // /…

new Server(app.handler).listen(8080)
```

### Error handling

```ts
import { Stack, Context } from 'mw'
import { Server } from 'http'

const app = new Stack(Context)

app.push(async (ctx, next) => {
  try {
    await next()
  }
  catch (e) {
    ctx.res.writeHead(500)
    ctx.res.end(e.stack)
  }
})

app.push(async ctx => {
  if (Math.random() < 1/13) {
    throw new Error(':^(')
  }
  ctx.res.end(':^)')
})

new Server(app.handler).listen(8080)
```

### Extending context

```ts
import { Stack, Context } from 'mw'
import { Server } from 'http'

class ExtendedContext extends Context {
  send(data: any, code = 200) {
    return new Promise<void>(ok => {
      this.res.writeHead(code)
      this.res.end(data, ok)
    })
  }
}

const app = new Stack(ExtendedContext)

app.push(async ctx => {
  await ctx.send('want some tea?', 418)
})

new Server(app.handler).listen(8080)
```
