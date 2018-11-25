import Koa from 'koa'
import Router from 'koa-router'
import { context } from './database/context'
import { entries } from './routes/entries'
// import { references } from './routes/references'
import { referenceTypes } from './routes/referenceTypes'
import { escoExample } from './routes/escoExample'

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

// Context
router.get('/context', async (ctx, next) => {
  ctx.body = JSON.stringify(context)
  next()
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  // Entries
  .use(entries.routes())
  .use(entries.allowedMethods())
  // References
  // .use(references.routes())
  // .use(references.allowedMethods())
  // ReferenceTypes
  .use(referenceTypes.routes())
  .use(referenceTypes.allowedMethods())
  // EscoExample
  .use(escoExample.routes())
  .use(escoExample.allowedMethods())

app.listen(3000)
