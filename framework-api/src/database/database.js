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
        id: 'isEssentialPartOf',
        label: 'is essential subskill/part of',
      },
      {
        id: 'isOptionalPartOf',
        label: 'is optional subskill/part of',
      },
      {
        id: 'needsAsPrerequisite',
        label: 'needs as prerequisite',
      },
      {
        id: 'isSimilarTo',
        label: 'is similar to',
      },
      {
        id: 'isSameAs',
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

export const getReferences = async () => {
  const driver = neo4j.driver(
    'bolt://db:7687',
    neo4j.auth.basic('neo4j', 'qwerqwer')
  )
  const session = driver.session()
  const { records } = await session.writeTransaction(tx =>
    tx.run(
      `MATCH (sourceNode)-[reference]-(targetNode) RETURN sourceNode.id, reference, targetNode.id`
    )
  )
  const data = records.map(entry => ({
    sourceID: `http://localhost:6060/entries/${entry.get('sourceNode.id')}`,
    referenceType: `http://localhost:6060/referenceTypes/${
      entry.get('reference').type
    }`,
    targetID: `http://localhost:6060/entries/${entry.get('targetNode.id')}`,
  }))
  session.close()
  driver.close()
  return Promise.resolve({
    meta: {},
    data,
  })
}

export const getEntries = async requestedId => {
  const driver = neo4j.driver(
    'bolt://db:7687',
    neo4j.auth.basic('neo4j', 'qwerqwer')
  )
  const session = driver.session()
  const whereClause = requestedId
    ? `WHERE currentNode.id = "${requestedId}"`
    : ''
  const result = await session.writeTransaction(tx =>
    tx.run(
      `MATCH (currentNode) ${whereClause} OPTIONAL MATCH (currentNode)-[relation]->(targetNode) ${whereClause} RETURN currentNode, collect(relation), collect(targetNode)`
    )
  )
  const { data: referenceTypes } = await getReferenceTypes()
  const referenceKeys = referenceTypes.map(({ id }) => id)
  const data = result.records
    .map(record => {
      const rawEntry = record.get('currentNode').properties
      const rawReferences = record.get('collect(relation)')
      const targetNodes = record.get('collect(targetNode)')
      const references = Object.assign(
        {},
        ...referenceKeys.map(k => ({ [k]: [] }))
      )
      rawReferences.forEach(({ type }, index) => {
        references[type].push(
          `http://localhost:6060/entries/${targetNodes[index].properties.id}`
        )
      })
      return {
        ...rawEntry,
        id: `http://localhost:6060/entries/${rawEntry.id}`,
        prefLabel: rawEntry.prefLabel.map(x => JSON.parse(x)),
        altLabel: rawEntry.altLabel.map(x => JSON.parse(x)),
        description: rawEntry.description.map(x => JSON.parse(x)),
        ...references,
      }
    })
    .sort((a, b) => a.id - b.id)
  session.close()
  driver.close()
  return Promise.resolve({
    meta: {},
    data,
  })
}
