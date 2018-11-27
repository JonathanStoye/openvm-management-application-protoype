import { competencies } from './competencies'
import { references } from './references'

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
  const data = requestedId
    ? competencies.filter(({ id }) => id === requestedId)
    : competencies
  return Promise.resolve({
    meta: {},
    data,
  })
}
