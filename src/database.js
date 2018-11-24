import { competencies } from './competencies'

export const getSkillType = async () =>
  Promise.resolve({
    meta: {},
    data: ['Knowledge', 'Skill or Competence'],
  })

export const getReferenceType = async () =>
  Promise.resolve({
    meta: {},
    data: [
      'is essential subskill/part of',
      'is optional subskill/part of',
      'needs as prerequisite',
      'is similar to',
      'is same as',
    ],
  })

export const getReusabilityLevel = async () =>
  Promise.resolve({
    meta: {},
    data: [
      'Transversal',
      'Cross-sectoral',
      'Sector-specific',
      'Occupation-specific',
    ],
  })

export const getReferences = async () =>
  Promise.resolve({
    meta: {},
    data: [
      'Transversal',
      'Cross-sectoral',
      'Sector-specific',
      'Occupation-specific',
    ],
  })

export const getEntry = async () =>
  Promise.resolve({
    meta: {},
    data: competencies,
  })
