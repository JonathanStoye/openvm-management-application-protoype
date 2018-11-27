import Router from 'koa-router'
import * as jsonld from 'jsonld'
import * as database from '../database/database'
/**
 * THIS IS UNUSED ATM
 */
const references = new Router({ prefix: '/references' })

references
  .get('/', async (ctx, next) => {
    const { data } = await database.getReferences()
    ctx.data = data
    console.log(data)
    await next()
  })
  .use(async (ctx, next) => {
    if (ctx.query.format === 'expanded') {
      ctx.body = await jsonld.expand(ctx.data)
    } else {
      ctx.body = await jsonld.compact(ctx.data, {
        '@context': 'http://localhost:3000/context/',
      })
    }
    await next()
  })

export { references }
