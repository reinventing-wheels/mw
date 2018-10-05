A small middleware framework in less than 100 lines of code

## Installation

```sh
yarn add reinventing-wheels/mw
```

## Usage

### Basics

```ts
import { App, Context } from 'mw'
import { Server } from 'http'

const app = new App(Context)

app.use(async (ctx, next) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`)
  await next()
})

app.use(async ctx => {
  ctx.res.end(`hello from ${ctx.path}`)
})

new Server(app.handler).listen(8080)
```

### Routes

```ts
import { App, Context } from 'mw'
import { Server } from 'http'

const app = new App(Context)

app.mount('/doge', async ctx => {
  ctx.res.end('wow much doge')
})

app.mount('/', async ctx => {
  ctx.res.end('wow such 404')
})

new Server(app.handler).listen(8080)
```

### Nested routes

```ts
import { App, Context } from 'mw'
import { Server } from 'http'

const bar = new App(Context)
const foo = new App(Context)
const app = new App(Context)

bar.mount('/', async ctx => ctx.res.end(`bar:${ctx.path}`)) // /foo/bar/…

foo.mount('/bar/', bar)
foo.mount('/', async ctx => ctx.res.end(`foo:${ctx.path}`)) // /foo/…

app.mount('/foo/', foo)
app.mount('/', async ctx => ctx.res.end(`app:${ctx.path}`)) // /…

new Server(app.handler).listen(8080)
```

### Error handling

```ts
import { App, Context } from 'mw'
import { Server } from 'http'

const app = new App(Context)

app.use(async (ctx, next) => {
  try {
    await next()
  }
  catch (e) {
    ctx.res.writeHead(500)
    ctx.res.end(e.stack)
  }
})

app.use(async ctx => {
  if (Math.random() < 1/13) {
    throw new Error(':^(')
  }
  ctx.res.end(':^)')
})

new Server(app.handler).listen(8080)
```

### Extending context

```ts
import { App, Context } from 'mw'
import { Server } from 'http'

class ExtendedContext extends Context {
  send(data: any, code = 200) {
    return new Promise<void>(ok => {
      this.res.writeHead(code)
      this.res.end(data, ok)
    })
  }
}

const app = new App(ExtendedContext)

app.use(async ctx => {
  await ctx.send('want some tea?', 418)
})

new Server(app.handler).listen(8080)
```
