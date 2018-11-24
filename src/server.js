import Koa from 'koa'
import Router from 'koa-router'
import * as jsonld from 'jsonld'
import * as database from './database'

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
    '@context': {
      id: '@id',
      value: '@value',
      type: '@type',
      language: '@language',
      hasAssociation: 'http://data.europa.eu/esco/model#hasAssociation',
      isEssentialSkillFor:
        'http://data.europa.eu/esco/model#isEssentialSkillFor',
      isOptionalSkillFor: 'http://data.europa.eu/esco/model#isOptionalSkillFor',
      referenceLanguage: 'http://data.europa.eu/esco/model#referenceLanguage',
      skillReuseLevel: 'http://data.europa.eu/esco/model#skillReuseLevel',
      skillType: 'http://data.europa.eu/esco/model#skillType',
      description: 'http://purl.org/dc/terms/description',
      modified: 'http://purl.org/dc/terms/modified',
      status: 'http://purl.org/iso25964/skos-thes#status',
      altLabel: 'http://www.w3.org/2004/02/skos/core#altLabel',
      inScheme: 'http://www.w3.org/2004/02/skos/core#inScheme',
      prefLabel: 'http://www.w3.org/2004/02/skos/core#prefLabel',
      topConceptOf: 'http://www.w3.org/2004/02/skos/core#topConceptOf',
    },
  }
  ctx.body = JSON.stringify(context)
  next()
})

const doc = {
  '@context': 'http://localhost:3000/context/',
  id: 'http://data.europa.eu/esco/skill/d0c425c6-e3de-465e-923d-d4d30ec4be9b',
  type: [
    'http://data.europa.eu/esco/model#Skill',
    'http://data.europa.eu/esco/model#MemberConcept',
    'http://www.w3.org/2004/02/skos/core#Concept',
  ],
  hasAssociation: [
    {
      id:
        'http://data.europa.eu/esco/relation/58F1874C-1AD9-11E7-B43F-E10FE2FA9FC2',
    },
    {
      id:
        'http://data.europa.eu/esco/relation/591303D6-1AD9-11E7-B43F-E10FE2FA9FC2',
    },
    {
      id:
        'http://data.europa.eu/esco/relation/5912FEEA-1AD9-11E7-B43F-E10FE2FA9FC2',
    },
  ],
  isEssentialSkillFor: [
    {
      id:
        'http://data.europa.eu/esco/occupation/04f39bfa-bc03-4480-98bc-b18ce4fe4b4b',
    },
    {
      id:
        'http://data.europa.eu/esco/occupation/caafca69-9faa-4850-8930-a3fa07fea4e6',
    },
    {
      id:
        'http://data.europa.eu/esco/occupation/cd4f41a5-87a6-4b3c-8ee3-14e6f457c365',
    },
  ],
  isOptionalSkillFor: [
    {
      id:
        'http://data.europa.eu/esco/occupation/1ad59946-d13e-441e-9b36-56e1df055e21',
    },
    {
      id:
        'http://data.europa.eu/esco/occupation/59c22779-4d89-4bc9-ba8b-d64bea236723',
    },
  ],
  referenceLanguage: [
    {
      value: 'en',
      type: 'http://www.w3.org/2001/XMLSchema#language',
    },
  ],
  skillReuseLevel: [
    {
      id: 'http://data.europa.eu/esco/skill-reuse-level/cross-sector',
    },
  ],
  skillType: [
    {
      id: 'http://data.europa.eu/esco/skill-type/knowledge',
    },
  ],
  description: [
    {
      id:
        'http://data.europa.eu/esco/node-literal/df82b827-e70d-4632-8dd7-637df0305fc2',
    },
    {
      id:
        'http://data.europa.eu/esco/node-literal/64b48e20-fee5-4f63-9cca-2a6294291049',
    },
  ],
  modified: [
    {
      value: '2016-12-20T18:05:57Z',
      type: 'http://www.w3.org/2001/XMLSchema#dateTime',
    },
  ],
  status: [
    {
      value: 'released',
    },
  ],
  altLabel: [
    {
      value: 'national accepted accounting principles',
      language: 'en',
    },
    {
      value: 'national generally accepted accountancy principles',
      language: 'en',
    },
    {
      value: 'national accounting principles which are generally accepted',
      language: 'en',
    },
  ],
  inScheme: [
    {
      id: 'http://data.europa.eu/esco/concept-scheme/member-skills',
    },
    {
      id: 'http://data.europa.eu/esco/concept-scheme/skills',
    },
  ],
  prefLabel: [
    {
      value: 'prinċipji nazzjonali tal-kontabilità ġeneralment aċċettati',
      language: 'mt',
    },
    {
      value: 'viðurkenndar þjóðhagslegar reikningsskilaaðferðir',
      language: 'is',
    },
    {
      value: 'nationale almindeligt anerkendte regnskabsprincipper',
      language: 'da',
    },
    {
      value: 'national generally accepted accounting principles',
      language: 'en-us',
    },
  ],
  topConceptOf: [
    {
      id: 'http://data.europa.eu/esco/concept-scheme/skills',
    },
    {
      id: 'http://data.europa.eu/esco/concept-scheme/member-skills',
    },
  ],
}

router.get('/example/compacted', async (ctx, next) => {
  const compacted = await jsonld.compact(doc, {
    '@context': 'http://localhost:3000/context/',
  })
  ctx.body = JSON.stringify(compacted)
  next()
})

router.get('/example/expanded', async (ctx, next) => {
  const expanded = await jsonld.expand(doc)
  ctx.body = JSON.stringify(expanded)
  next()
})

router.get('/', async (ctx, next) => {
  const { data } = await database.getEntry()
  const entries = data.map(date =>
    Object.assign({}, date, { '@context': 'http://localhost:3000/context/' })
  )
  const compacted = await jsonld.compact(entries, {
    '@context': 'http://localhost:3000/context/',
  })
  ctx.body = JSON.stringify(compacted)
  next()
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
