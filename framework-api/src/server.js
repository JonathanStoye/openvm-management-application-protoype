import Koa from 'koa'
import Router from 'koa-router'
import { context } from './database/context'
import { entries } from './routes/entries'
// import { references } from './routes/references'
import { referenceTypes } from './routes/referenceTypes'
import { escoExample } from './routes/escoExample'
import neo4j from 'neo4j-driver'
import { competencies } from './database/competencies'
import { references } from './database/references'

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

// DB Driver and session setup
app.use(async (ctx, next) => {
  ctx.driver = neo4j.driver(
    'bolt://192.168.178.47:7687',
    neo4j.auth.basic('neo4j', 'qwerqwer')
  )
  ctx.session = ctx.driver.session()
  await next()
  ctx.session.close()
  ctx.driver.close()
})

router.get('/deleteAll', async (ctx, next) => {
  const result = await ctx.session.writeTransaction(tx =>
    tx.run('MATCH (n) DETACH DELETE n')
  )
  ctx.body = JSON.stringify(result)
  await next()
})

router.get('/populate', async (ctx, next) => {
  const props = competencies.map(competency => ({
    ...competency,
    prefLabel: competency.prefLabel.map(x => JSON.stringify(x)),
    altLabel: competency.altLabel.map(x => JSON.stringify(x)),
    description: competency.description.map(x => JSON.stringify(x)),
  }))
  await ctx.session.writeTransaction(tx =>
    tx.run(
      `
      UNWIND $props AS entry
      CREATE (node:entry)
      SET node = entry
      `,
      { props }
    )
  )
  await references.forEach(async ({ sourceId, referenceType, targetId }) => {
    const session = ctx.driver.session()
    await session.writeTransaction(tx =>
      tx.run(
        `
        MATCH (a:entry),(b:entry)
        WHERE a.id = "${sourceId}" AND b.id = "${targetId}"
        CREATE (a)-[r:${referenceType}]->(b)
        `
      )
    )
    session.close()
  })
  const result = await ctx.session.writeTransaction(tx =>
    tx.run(
      `MATCH (n)
      RETURN n`
    )
  )
  ctx.body = JSON.stringify(result)
  await next()
})

// Get all
router.get('/', async (ctx, next) => {
  const result = await ctx.session.writeTransaction(tx =>
    tx.run(
      `MATCH (n)
      RETURN n`
    )
  )
  ctx.body = JSON.stringify(result)
  await next()
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
