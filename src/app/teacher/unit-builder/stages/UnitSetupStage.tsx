'use client'

import { useI18n } from '@/lib/i18n'
import { useUnitBuilder } from '@/lib/unit-builder-store'
import { FormField } from '@/components/ui/FormField'

const YEAR_GROUPS = [
  'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
]

const DURATIONS = [
  '1 week', '2 weeks', '3 weeks', '4 weeks', '5 weeks', '6 weeks',
  '1 semester',
]

export function UnitSetupStage() {
  const { t } = useI18n()
  const { state, dispatch } = useUnitBuilder()
  const { setup } = state

  const updateField = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_SETUP', data: { [field]: value } })
  }

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {t('unitBuilder.stages.setup')}
      </h2>

      <FormField label={t('unitBuilder.setup.unitTitle')} required>
        <input
          type="text"
          value={setup.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="input-field"
          placeholder="e.g., Water Waste Investigation"
        />
      </FormField>

      <FormField label={t('unitBuilder.setup.yearGroup')} required>
        <select
          value={setup.yearGroup}
          onChange={(e) => updateField('yearGroup', e.target.value)}
          className="input-field"
        >
          <option value="">-- Select --</option>
          {YEAR_GROUPS.map((yg) => (
            <option key={yg} value={yg}>{yg}</option>
          ))}
        </select>
      </FormField>

      <FormField label={t('unitBuilder.setup.duration')} required>
        <select
          value={setup.duration}
          onChange={(e) => updateField('duration', e.target.value)}
          className="input-field"
        >
          <option value="">-- Select --</option>
          {DURATIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label={t('unitBuilder.setup.interdisciplinary')}
        hint="e.g., Science (water cycle), Geography (local water systems), Citizenship"
      >
        <textarea
          value={setup.interdisciplinaryConnections}
          onChange={(e) => updateField('interdisciplinaryConnections', e.target.value)}
          className="input-field min-h-[80px]"
          rows={3}
        />
      </FormField>
    </div>
  )
}
