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

router.get('/', async (ctx, next) => {
  var doc = {
    'http://schema.org/name': 'Manu Sporny',
    'http://schema.org/url': { '@id': 'http://manu.sporny.org/' },
    'http://schema.org/image': {
      '@id': 'http://manu.sporny.org/images/manu.png',
    },
  }

  var context = {
    name: 'http://schema.org/name',
    homepage: { '@id': 'http://schema.org/url', '@type': '@id' },
    image: { '@id': 'http://schema.org/image', '@type': '@id' },
  }

  const compacted = await jsonld.compact(doc, context)
  ctx.body = JSON.stringify(compacted)
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
