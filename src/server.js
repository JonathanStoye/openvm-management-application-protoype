import Koa from 'koa'
import Router from 'koa-router'
import * as jsonld from 'jsonld'

const app = new Koa()
const router = new Router()

// logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// Set defaults for the api
app.use(async (ctx, next) => {
  ctx.type = 'application/json'
  await next()
})

router.get('/context', async (ctx, next) => {
  const context = {
    '@context': 'http://schema.org/',
  }
  ctx.body = JSON.stringify(context)
  next()
})

router.get('/example/compacted', async (ctx, next) => {
  const doc = {
    '@context': 'http://localhost:3000/context/',
    '@type': 'Person',
    name: 'Jane Doe',
    jobTitle: 'Professor',
    telephone: '(425) 123-4567',
    url: 'http://www.janedoe.com',
  }

  const compacted = await jsonld.compact(doc, {
    '@context': 'http://localhost:3000/context/',
  })
  ctx.body = JSON.stringify(compacted)
  next()
})

router.get('/example/expanded', async (ctx, next) => {
  const compacted = {
    '@context': 'http://localhost:3000/context/',
    type: 'Person',
    jobTitle: 'Professor',
    name: 'Jane Doe',
    telephone: '(425) 123-4567',
    url: 'http://www.janedoe.com',
  }

  const expanded = await jsonld.expand(compacted)
  ctx.body = JSON.stringify(expanded)
  next()
})

router.get('/', async (ctx, next) => {
  ctx.body = JSON.stringify('Hello')
  next()
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
