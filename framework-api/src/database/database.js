import { references } from './references'
import neo4j from 'neo4j-driver'

export const getSkillTypes = async () =>
  Promise.resolve({
    meta: {},
    data: ['Knowledge', 'Skill or Competence'],
  })

export const getReferenceTypes = async () =>
  Promise.resolve({
    meta: {},
    data: [
      {
        id: 'ESSENTIAL',
        label: 'is essential subskill/part of',
      },
      {
        id: 'OPTIONAL',
        label: 'is optional subskill/part of',
      },
      {
        id: 'PREREQUISITE',
        label: 'needs as prerequisite',
      },
      {
        id: 'SIMILAR',
        label: 'is similar to',
      },
      {
        id: 'SAME',
        label: 'is same as',
      },
    ],
  })

export const getReusabilityLevel = async () =>
  Promise.resolve({
    meta: {},
    data: [
      { id: '1', value: 'Transversal' },
      { id: '2', value: 'Cross-sectoral' },
      { id: '3', value: 'Sector-specific' },
      { id: '4', value: 'Occupation-specific' },
    ],
  })

export const getReferences = async () =>
  Promise.resolve({
    meta: {},
    data: references,
  })

export const getEntries = async requestedId => {
  const driver = neo4j.driver(
    'bolt://db:7687',
    neo4j.auth.basic('neo4j', 'qwerqwer')
  )
  const whereClause = requestedId ? `WHERE n.id = "${requestedId}"` : ''
  const session = driver.session()
  const result = await session.writeTransaction(tx =>
    tx.run(`MATCH (n) ${whereClause} RETURN n`)
  )
  const data = result.records.map(record => {
    const rawEntry = record.get('n').properties
    return {
      ...rawEntry,
      prefLabel: rawEntry.prefLabel.map(x => JSON.parse(x)),
      altLabel: rawEntry.altLabel.map(x => JSON.parse(x)),
      description: rawEntry.description.map(x => JSON.parse(x)),
    }
  })
  session.close()
  driver.close()
  return Promise.resolve({
    meta: {},
    data,
  })
}
