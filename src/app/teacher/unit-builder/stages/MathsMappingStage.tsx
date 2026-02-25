'use client'

import { useI18n } from '@/lib/i18n'
import { useUnitBuilder } from '@/lib/unit-builder-store'
import { FormField } from '@/components/ui/FormField'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { TagInput } from '@/components/ui/TagInput'

const STRAND_OPTIONS = [
  { value: 'number', labelKey: 'unitBuilder.mathsMapping.strandOptions.number' },
  { value: 'geometry', labelKey: 'unitBuilder.mathsMapping.strandOptions.geometry' },
  { value: 'statistics', labelKey: 'unitBuilder.mathsMapping.strandOptions.statistics' },
  { value: 'algebra', labelKey: 'unitBuilder.mathsMapping.strandOptions.algebra' },
  { value: 'fractions', labelKey: 'unitBuilder.mathsMapping.strandOptions.fractions' },
]

const PROCESS_OPTIONS = [
  { value: 'problemSolving', labelKey: 'unitBuilder.mathsMapping.processOptions.problemSolving' },
  { value: 'reasoning', labelKey: 'unitBuilder.mathsMapping.processOptions.reasoning' },
  { value: 'communicating', labelKey: 'unitBuilder.mathsMapping.processOptions.communicating' },
  { value: 'representing', labelKey: 'unitBuilder.mathsMapping.processOptions.representing' },
  { value: 'connecting', labelKey: 'unitBuilder.mathsMapping.processOptions.connecting' },
]

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  number: [
    'Place value', 'Addition', 'Subtraction', 'Multiplication', 'Division',
    'Number patterns', 'Estimation', 'Mental calculation',
  ],
  geometry: [
    'Area', 'Perimeter', 'Volume', 'Angles', 'Shape properties',
    'Symmetry', 'Position and direction', 'Scale', 'Units of measure',
  ],
  statistics: [
    'Data collection', 'Bar charts', 'Pictograms', 'Tables',
    'Averages (mean)', 'Interpreting data', 'Frequency', 'Tally charts',
  ],
  algebra: [
    'Patterns', 'Sequences', 'Simple equations', 'Function machines',
    'Variables', 'Missing number problems',
  ],
  fractions: [
    'Equivalent fractions', 'Comparing fractions', 'Decimals',
    'Percentages', 'Fractions of amounts', 'Ratio', 'Proportion',
  ],
}

export function MathsMappingStage() {
  const { t } = useI18n()
  const { state, dispatch } = useUnitBuilder()
  const { mathsMapping } = state

  const strandOptions = STRAND_OPTIONS.map((s) => ({
    value: s.value,
    label: t(s.labelKey),
  }))

  const processOptions = PROCESS_OPTIONS.map((p) => ({
    value: p.value,
    label: t(p.labelKey),
  }))

  // Aggregate skill suggestions based on selected strands
  const skillSuggestions = mathsMapping.strands.flatMap(
    (strand) => SKILL_SUGGESTIONS[strand] || []
  )

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {t('unitBuilder.mathsMapping.title')}
      </h2>

      {/* Strand selector */}
      <MultiSelect
        label={t('unitBuilder.mathsMapping.strands')}
        options={strandOptions}
        selected={mathsMapping.strands}
        onChange={(strands) =>
          dispatch({ type: 'UPDATE_MATHS_MAPPING', data: { strands } })
        }
      />

      {/* Skills */}
      <FormField label={t('unitBuilder.mathsMapping.skills')}>
        <TagInput
          tags={mathsMapping.skills}
          onChange={(skills) =>
            dispatch({ type: 'UPDATE_MATHS_MAPPING', data: { skills } })
          }
          placeholder="Type a skill and press Enter"
          suggestions={skillSuggestions}
        />
      </FormField>

      {/* Processes */}
      <MultiSelect
        label={t('unitBuilder.mathsMapping.processes')}
        options={processOptions}
        selected={mathsMapping.processes}
        onChange={(processes) =>
          dispatch({ type: 'UPDATE_MATHS_MAPPING', data: { processes } })
        }
      />

      {/* Cognitive Demand */}
      <FormField label={t('unitBuilder.mathsMapping.cognitiveDemand')}>
        <div className="flex gap-3">
          {(['procedural', 'conceptual', 'both'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                dispatch({
                  type: 'UPDATE_MATHS_MAPPING',
                  data: { cognitiveDemand: option },
                })
              }
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
                mathsMapping.cognitiveDemand === option
                  ? 'border-ikigai-primary bg-blue-50 text-ikigai-primary'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t(`unitBuilder.mathsMapping.demandOptions.${option}`)}
            </button>
          ))}
        </div>
      </FormField>

      {/* Prior Knowledge */}
      <FormField label={t('unitBuilder.mathsMapping.priorKnowledge')}>
        <textarea
          value={mathsMapping.priorKnowledge}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_MATHS_MAPPING',
              data: { priorKnowledge: e.target.value },
            })
          }
          className="input-field min-h-[80px]"
          rows={3}
          placeholder="What mathematical knowledge do students need before starting?"
        />
      </FormField>

      {/* Vocabulary */}
      <FormField label={t('unitBuilder.mathsMapping.vocabulary')}>
        <TagInput
          tags={mathsMapping.vocabulary}
          onChange={(vocabulary) =>
            dispatch({ type: 'UPDATE_MATHS_MAPPING', data: { vocabulary } })
          }
          placeholder="Type a term and press Enter"
        />
      </FormField>

      {/* Extension */}
      <FormField label={t('unitBuilder.mathsMapping.extension')}>
        <textarea
          value={mathsMapping.extension}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_MATHS_MAPPING',
              data: { extension: e.target.value },
            })
          }
          className="input-field min-h-[60px]"
          rows={2}
        />
      </FormField>

      {/* Cambridge Objectives */}
      <FormField
        label={t('unitBuilder.mathsMapping.cambridgeObjectives')}
        hint="Format: Code — Objective description (e.g., 3Nn1 — Recite numbers 100 to 200)"
      >
        <textarea
          value={mathsMapping.cambridgeObjectives}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_MATHS_MAPPING',
              data: { cambridgeObjectives: e.target.value },
            })
          }
          className="input-field min-h-[100px]"
          rows={4}
        />
      </FormField>
    </div>
  )
}
