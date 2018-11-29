import Router from 'koa-router'
import * as jsonld from 'jsonld'
import * as database from '../database/database'

const entries = new Router({
  prefix: '/entries',
})

entries
  .get('/', async (ctx, next) => {
    const { data } = await database.getEntries()
    ctx.data = data
    await next()
  })
  .get('/:id', async (ctx, next) => {
    const { data } = await database.getEntries(ctx.params.id)
    ctx.data = data
    await next()
  })
  .use(async (ctx, next) => {
    if (ctx.data.length < 1) {
      ctx.status = 404
      ctx.body = JSON.stringify({ error: 'Unknown Entry ID' })
      return undefined
    }
    await next()
  })
  .use(async (ctx, next) => {
    const entries = ctx.data.map(date => {
      return {
        ...date,
        '@context': 'http://localhost:6000/context/',
      }
    })
    ctx.entries = entries
    await next()
  })
  .use(async (ctx, next) => {
    if (ctx.query.format === 'expanded') {
      ctx.body = await jsonld.expand(ctx.entries)
    } else {
      ctx.body = await jsonld.compact(ctx.entries, {
        '@context': 'http://localhost:6000/context/',
      })
    }
    await next()
  })

export { entries }
