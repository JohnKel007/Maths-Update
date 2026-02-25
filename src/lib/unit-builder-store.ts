'use client'

import { createContext, useContext } from 'react'

export interface UnitSetupData {
  title: string
  yearGroup: string
  duration: string
  interdisciplinaryConnections: string
}

export interface PhenomenonData {
  statement: string
  whyItMatters: string
  studentQuestions: string
  mathsDemanded: string
  subjectLinks: string
  experienceMethod: string
  checklist: {
    observable: boolean
    generatesQuestions: boolean
    demandsMaths: boolean
    locallyRelevant: boolean
    appropriatelyComplex: boolean
    interdisciplinary: boolean
    ageAppropriate: boolean
  }
}

export interface MathsMappingData {
  strands: string[]
  skills: string[]
  processes: string[]
  cognitiveDemand: 'procedural' | 'conceptual' | 'both'
  priorKnowledge: string
  vocabulary: string[]
  extension: string
  cambridgeObjectives: string
}

export interface DrivingQuestionCandidate {
  question: string
  scores: {
    openEnded: number
    mathsRequired: number
    studentRelevance: number
    locallyInvestigable: number
    realAudience: number
    extensionPotential: number
  }
}

export interface DrivingQuestionData {
  customStem: string
  candidates: DrivingQuestionCandidate[]
  selectedQuestion: string
}

export interface UnitBuilderState {
  currentStage: number
  completedStages: number[]
  unitId: string | null
  setup: UnitSetupData
  phenomenon: PhenomenonData
  mathsMapping: MathsMappingData
  drivingQuestion: DrivingQuestionData
}

export const initialUnitBuilderState: UnitBuilderState = {
  currentStage: 0,
  completedStages: [],
  unitId: null,
  setup: {
    title: '',
    yearGroup: '',
    duration: '',
    interdisciplinaryConnections: '',
  },
  phenomenon: {
    statement: '',
    whyItMatters: '',
    studentQuestions: '',
    mathsDemanded: '',
    subjectLinks: '',
    experienceMethod: '',
    checklist: {
      observable: false,
      generatesQuestions: false,
      demandsMaths: false,
      locallyRelevant: false,
      appropriatelyComplex: false,
      interdisciplinary: false,
      ageAppropriate: false,
    },
  },
  mathsMapping: {
    strands: [],
    skills: [],
    processes: [],
    cognitiveDemand: 'both',
    priorKnowledge: '',
    vocabulary: [],
    extension: '',
    cambridgeObjectives: '',
  },
  drivingQuestion: {
    customStem: '',
    candidates: [],
    selectedQuestion: '',
  },
}

export type UnitBuilderAction =
  | { type: 'SET_STAGE'; stage: number }
  | { type: 'COMPLETE_STAGE'; stage: number }
  | { type: 'SET_UNIT_ID'; unitId: string }
  | { type: 'UPDATE_SETUP'; data: Partial<UnitSetupData> }
  | { type: 'UPDATE_PHENOMENON'; data: Partial<PhenomenonData> }
  | { type: 'UPDATE_PHENOMENON_CHECKLIST'; key: string; value: boolean }
  | { type: 'UPDATE_MATHS_MAPPING'; data: Partial<MathsMappingData> }
  | { type: 'UPDATE_DRIVING_QUESTION'; data: Partial<DrivingQuestionData> }
  | { type: 'LOAD_UNIT'; data: UnitBuilderState }

export function unitBuilderReducer(
  state: UnitBuilderState,
  action: UnitBuilderAction
): UnitBuilderState {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.stage }

    case 'COMPLETE_STAGE':
      return {
        ...state,
        completedStages: state.completedStages.includes(action.stage)
          ? state.completedStages
          : [...state.completedStages, action.stage],
      }

    case 'SET_UNIT_ID':
      return { ...state, unitId: action.unitId }

    case 'UPDATE_SETUP':
      return { ...state, setup: { ...state.setup, ...action.data } }

    case 'UPDATE_PHENOMENON':
      return { ...state, phenomenon: { ...state.phenomenon, ...action.data } }

    case 'UPDATE_PHENOMENON_CHECKLIST':
      return {
        ...state,
        phenomenon: {
          ...state.phenomenon,
          checklist: {
            ...state.phenomenon.checklist,
            [action.key]: action.value,
          },
        },
      }

    case 'UPDATE_MATHS_MAPPING':
      return { ...state, mathsMapping: { ...state.mathsMapping, ...action.data } }

    case 'UPDATE_DRIVING_QUESTION':
      return { ...state, drivingQuestion: { ...state.drivingQuestion, ...action.data } }

    case 'LOAD_UNIT':
      return action.data

    default:
      return state
  }
}

export interface UnitBuilderContextType {
  state: UnitBuilderState
  dispatch: React.Dispatch<UnitBuilderAction>
}

export const UnitBuilderContext = createContext<UnitBuilderContextType>({
  state: initialUnitBuilderState,
  dispatch: () => {},
})

export function useUnitBuilder() {
  return useContext(UnitBuilderContext)
}

export function getPhenomenonScore(checklist: PhenomenonData['checklist']): number {
  return Object.values(checklist).filter(Boolean).length
}
