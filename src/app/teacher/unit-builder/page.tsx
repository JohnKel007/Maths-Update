'use client'

import { useReducer, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { StageProgress } from '@/components/ui/StageProgress'
import {
  UnitBuilderContext,
  unitBuilderReducer,
  initialUnitBuilderState,
} from '@/lib/unit-builder-store'
import { UnitSetupStage } from './stages/UnitSetupStage'
import { PhenomenonStage } from './stages/PhenomenonStage'
import { MathsMappingStage } from './stages/MathsMappingStage'
import { DrivingQuestionStage } from './stages/DrivingQuestionStage'

export default function UnitBuilderPage() {
  const { t } = useI18n()
  const [state, dispatch] = useReducer(unitBuilderReducer, initialUnitBuilderState)
  const [saving, setSaving] = useState(false)

  const goToNextStage = () => {
    dispatch({ type: 'COMPLETE_STAGE', stage: state.currentStage })
    dispatch({ type: 'SET_STAGE', stage: state.currentStage + 1 })
  }

  const goToPreviousStage = () => {
    if (state.currentStage > 0) {
      dispatch({ type: 'SET_STAGE', stage: state.currentStage - 1 })
    }
  }

  const saveUnit = async () => {
    setSaving(true)
    try {
      if (!state.unitId) {
        // Create new unit
        const res = await fetch('/api/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.setup),
        })
        const unit = await res.json()
        dispatch({ type: 'SET_UNIT_ID', unitId: unit.id })
        return unit.id
      } else {
        // Update existing unit
        await fetch(`/api/units/${state.unitId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.setup),
        })
        return state.unitId
      }
    } finally {
      setSaving(false)
    }
  }

  const savePhenomenon = async (unitId: string) => {
    await fetch(`/api/units/${unitId}/phenomenon`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.phenomenon),
    })
  }

  const saveMathsMapping = async (unitId: string) => {
    await fetch(`/api/units/${unitId}/maths-mapping`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.mathsMapping),
    })
  }

  const saveDrivingQuestion = async (unitId: string) => {
    await fetch(`/api/units/${unitId}/driving-question`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.drivingQuestion),
    })
  }

  const handleSaveAndNext = async () => {
    setSaving(true)
    try {
      let unitId = state.unitId

      if (state.currentStage === 0) {
        unitId = await saveUnit()
      } else if (unitId) {
        await saveUnit()
        if (state.currentStage === 1) {
          await savePhenomenon(unitId)
        } else if (state.currentStage === 2) {
          await saveMathsMapping(unitId)
        } else if (state.currentStage === 3) {
          await saveDrivingQuestion(unitId)
        }
      }

      goToNextStage()
    } finally {
      setSaving(false)
    }
  }

  const renderCurrentStage = () => {
    switch (state.currentStage) {
      case 0:
        return <UnitSetupStage />
      case 1:
        return <PhenomenonStage />
      case 2:
        return <MathsMappingStage />
      case 3:
        return <DrivingQuestionStage />
      default:
        return (
          <div className="card text-center py-12">
            <p className="text-gray-500">
              Stages 4-7 coming soon in Phase B.
            </p>
          </div>
        )
    }
  }

  return (
    <UnitBuilderContext.Provider value={{ state, dispatch }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('unitBuilder.title')}
          </h1>
          {state.unitId && (
            <span className="text-xs text-gray-400">
              ID: {state.unitId}
            </span>
          )}
        </div>

        <StageProgress
          currentStage={state.currentStage}
          completedStages={state.completedStages}
          onStageClick={(stage) => dispatch({ type: 'SET_STAGE', stage })}
        />

        <div className="mt-6">{renderCurrentStage()}</div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={goToPreviousStage}
            disabled={state.currentStage === 0}
            className="btn-secondary"
          >
            {t('common.previous')}
          </button>

          <button
            onClick={handleSaveAndNext}
            disabled={saving}
            className="btn-primary"
          >
            {saving
              ? t('common.loading')
              : state.currentStage < 3
              ? `${t('common.save')} & ${t('common.next')}`
              : t('common.save')}
          </button>
        </div>
      </div>
    </UnitBuilderContext.Provider>
  )
}
