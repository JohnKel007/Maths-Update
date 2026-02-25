'use client'

import { useI18n } from '@/lib/i18n'
import { useUnitBuilder, getPhenomenonScore } from '@/lib/unit-builder-store'
import { FormField } from '@/components/ui/FormField'
import { CheckboxItem } from '@/components/ui/CheckboxItem'
import { WarningBanner } from '@/components/ui/WarningBanner'

const CHECKLIST_KEYS = [
  'observable',
  'generatesQuestions',
  'demandsMaths',
  'locallyRelevant',
  'appropriatelyComplex',
  'interdisciplinary',
  'ageAppropriate',
] as const

export function PhenomenonStage() {
  const { t } = useI18n()
  const { state, dispatch } = useUnitBuilder()
  const { phenomenon } = state

  const score = getPhenomenonScore(phenomenon.checklist)
  const isWeak = score < 5

  const updateField = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_PHENOMENON', data: { [field]: value } })
  }

  return (
    <div className="space-y-6">
      {/* Checklist */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('unitBuilder.phenomenon.checklist.title')}
          </h2>
          <span
            className={`text-sm font-bold px-3 py-1 rounded-full ${
              isWeak
                ? 'bg-amber-100 text-amber-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {score}/7
          </span>
        </div>

        <div className="space-y-2">
          {CHECKLIST_KEYS.map((key) => (
            <CheckboxItem
              key={key}
              id={`checklist-${key}`}
              label={t(`unitBuilder.phenomenon.checklist.${key}`)}
              checked={phenomenon.checklist[key]}
              onChange={(value) =>
                dispatch({
                  type: 'UPDATE_PHENOMENON_CHECKLIST',
                  key,
                  value,
                })
              }
            />
          ))}
        </div>

        <WarningBanner
          show={isWeak && score > 0}
          message={t('unitBuilder.phenomenon.weakWarning')}
        />
      </div>

      {/* Phenomenon details */}
      <div className="card space-y-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('unitBuilder.phenomenon.title')}
        </h2>

        <FormField label={t('unitBuilder.phenomenon.statement')} required>
          <textarea
            value={phenomenon.statement}
            onChange={(e) => updateField('statement', e.target.value)}
            className="input-field min-h-[100px]"
            rows={4}
            placeholder="Describe the phenomenon students will investigate..."
          />
        </FormField>

        <FormField label={t('unitBuilder.phenomenon.whyItMatters')}>
          <textarea
            value={phenomenon.whyItMatters}
            onChange={(e) => updateField('whyItMatters', e.target.value)}
            className="input-field min-h-[80px]"
            rows={3}
          />
        </FormField>

        <FormField label={t('unitBuilder.phenomenon.studentQuestions')}>
          <textarea
            value={phenomenon.studentQuestions}
            onChange={(e) => updateField('studentQuestions', e.target.value)}
            className="input-field min-h-[80px]"
            rows={3}
            placeholder="What questions might students ask when they encounter this phenomenon?"
          />
        </FormField>

        <FormField label={t('unitBuilder.phenomenon.mathsDemanded')}>
          <textarea
            value={phenomenon.mathsDemanded}
            onChange={(e) => updateField('mathsDemanded', e.target.value)}
            className="input-field min-h-[80px]"
            rows={3}
            placeholder="What mathematics will students need to understand this phenomenon?"
          />
        </FormField>

        <FormField label={t('unitBuilder.phenomenon.subjectLinks')}>
          <textarea
            value={phenomenon.subjectLinks}
            onChange={(e) => updateField('subjectLinks', e.target.value)}
            className="input-field min-h-[60px]"
            rows={2}
          />
        </FormField>

        <FormField label={t('unitBuilder.phenomenon.experienceMethod')}>
          <textarea
            value={phenomenon.experienceMethod}
            onChange={(e) => updateField('experienceMethod', e.target.value)}
            className="input-field min-h-[80px]"
            rows={3}
            placeholder="How will students first encounter or experience this phenomenon?"
          />
        </FormField>
      </div>
    </div>
  )
}
