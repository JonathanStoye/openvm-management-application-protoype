import Router from 'koa-router'
import * as jsonld from 'jsonld'
import * as database from '../database/database'

const referenceTypes = new Router({ prefix: '/referenceTypes' })

referenceTypes
  .get('/', async (ctx, next) => {
    const { data } = await database.getReferenceTypes()
    ctx.data = data
    await next()
  })
  .use(async (ctx, next) => {
    const entries = ctx.data.map(date =>
      Object.assign({}, date, {
        '@context': 'http://localhost:6060/context',
        id: `http://localhost:6060/referenceTypes/${date.id}`,
        key: date.id,
      })
    )
    ctx.entries = entries
    await next()
  })
  .use(async (ctx, next) => {
    if (ctx.query.format === 'expanded') {
      ctx.body = await jsonld.expand(ctx.entries)
    } else {
      ctx.body = await jsonld.compact(ctx.entries, {
        '@context': 'http://localhost:6060/context/',
      })
    }
    await next()
  })

export { referenceTypes }
