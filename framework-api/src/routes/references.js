import Router from 'koa-router'
import * as database from '../database/database'
/**
 * THIS IS UNUSED ATM
 */
const references = new Router({ prefix: '/references' })

references.get('/', async (ctx, next) => {
  const { data } = await database.getReferences()
  ctx.body = JSON.stringify(data)
  await next()
})

export { references }
