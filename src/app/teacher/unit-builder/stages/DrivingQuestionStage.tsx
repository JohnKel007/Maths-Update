'use client'

import { useI18n } from '@/lib/i18n'
import { useUnitBuilder, DrivingQuestionCandidate } from '@/lib/unit-builder-store'
import { FormField } from '@/components/ui/FormField'

const CRITERIA_KEYS = [
  'openEnded',
  'mathsRequired',
  'studentRelevance',
  'locallyInvestigable',
  'realAudience',
  'extensionPotential',
] as const

type CriteriaKey = (typeof CRITERIA_KEYS)[number]

function getCandidateTotal(candidate: DrivingQuestionCandidate): number {
  return Object.values(candidate.scores).reduce((sum, score) => sum + score, 0)
}

function getRecommendedIndex(candidates: DrivingQuestionCandidate[]): number {
  if (candidates.length === 0) return -1
  let maxScore = -1
  let maxIndex = 0
  candidates.forEach((c, i) => {
    const total = getCandidateTotal(c)
    if (total > maxScore) {
      maxScore = total
      maxIndex = i
    }
  })
  return maxIndex
}

export function DrivingQuestionStage() {
  const { t } = useI18n()
  const { state, dispatch } = useUnitBuilder()
  const { drivingQuestion } = state

  const stems: string[] = t('unitBuilder.drivingQuestion.stems') as unknown as string[]
  const stemList = Array.isArray(stems) ? stems : []

  const recommendedIndex = getRecommendedIndex(drivingQuestion.candidates)

  const addCandidate = () => {
    const newCandidate: DrivingQuestionCandidate = {
      question: '',
      scores: {
        openEnded: 1,
        mathsRequired: 1,
        studentRelevance: 1,
        locallyInvestigable: 1,
        realAudience: 1,
        extensionPotential: 1,
      },
    }
    dispatch({
      type: 'UPDATE_DRIVING_QUESTION',
      data: {
        candidates: [...drivingQuestion.candidates, newCandidate],
      },
    })
  }

  const updateCandidate = (index: number, updates: Partial<DrivingQuestionCandidate>) => {
    const updated = drivingQuestion.candidates.map((c, i) =>
      i === index ? { ...c, ...updates } : c
    )
    dispatch({
      type: 'UPDATE_DRIVING_QUESTION',
      data: { candidates: updated },
    })
  }

  const updateCandidateScore = (index: number, criterion: CriteriaKey, score: number) => {
    const updated = drivingQuestion.candidates.map((c, i) =>
      i === index
        ? { ...c, scores: { ...c.scores, [criterion]: score } }
        : c
    )
    dispatch({
      type: 'UPDATE_DRIVING_QUESTION',
      data: { candidates: updated },
    })
  }

  const removeCandidate = (index: number) => {
    const updated = drivingQuestion.candidates.filter((_, i) => i !== index)
    dispatch({
      type: 'UPDATE_DRIVING_QUESTION',
      data: { candidates: updated },
    })
  }

  const selectAsMain = (question: string) => {
    dispatch({
      type: 'UPDATE_DRIVING_QUESTION',
      data: { selectedQuestion: question },
    })
  }

  return (
    <div className="space-y-6">
      {/* Stem Selector */}
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('unitBuilder.drivingQuestion.title')}
        </h2>

        <FormField label={t('unitBuilder.drivingQuestion.stemSelector')}>
          <select
            value={drivingQuestion.customStem}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_DRIVING_QUESTION',
                data: { customStem: e.target.value },
              })
            }
            className="input-field"
          >
            <option value="">-- Select a stem --</option>
            {stemList.map((stem, i) => (
              <option key={i} value={stem}>{stem}</option>
            ))}
          </select>
        </FormField>

        <FormField label={t('unitBuilder.drivingQuestion.customStem')}>
          <input
            type="text"
            value={drivingQuestion.customStem}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_DRIVING_QUESTION',
                data: { customStem: e.target.value },
              })
            }
            className="input-field"
            placeholder="Or type a custom question stem..."
          />
        </FormField>
      </div>

      {/* Candidate Questions */}
      <div className="space-y-4">
        {drivingQuestion.candidates.map((candidate, index) => (
          <div
            key={index}
            className={`card space-y-4 ${
              index === recommendedIndex
                ? 'ring-2 ring-green-500 ring-offset-2'
                : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <FormField
                  label={`${t('unitBuilder.drivingQuestion.candidate')} ${index + 1}`}
                >
                  <textarea
                    value={candidate.question}
                    onChange={(e) =>
                      updateCandidate(index, { question: e.target.value })
                    }
                    className="input-field"
                    rows={2}
                    placeholder={drivingQuestion.customStem || 'Enter your driving question...'}
                  />
                </FormField>
              </div>
              <button
                type="button"
                onClick={() => removeCandidate(index)}
                className="text-gray-400 hover:text-red-500 p-2"
                aria-label="Remove candidate"
              >
                ×
              </button>
            </div>

            {/* Scoring Matrix */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                {t('unitBuilder.drivingQuestion.testingMatrix')}
              </h4>
              <div className="grid gap-3">
                {CRITERIA_KEYS.map((criterion) => (
                  <div key={criterion} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                      {t(`unitBuilder.drivingQuestion.criteria.${criterion}`)}
                    </span>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() =>
                            updateCandidateScore(index, criterion, score)
                          }
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            candidate.scores[criterion] === score
                              ? score === 3
                                ? 'bg-green-500 text-white'
                                : score === 2
                                ? 'bg-amber-500 text-white'
                                : 'bg-red-400 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-2">
                      {t(`unitBuilder.drivingQuestion.scores.${candidate.scores[criterion]}`)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total and actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    Total: {getCandidateTotal(candidate)}/18
                  </span>
                  {index === recommendedIndex && drivingQuestion.candidates.length > 1 && (
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {t('unitBuilder.drivingQuestion.recommended')}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => selectAsMain(candidate.question)}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                    drivingQuestion.selectedQuestion === candidate.question
                      ? 'bg-ikigai-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {drivingQuestion.selectedQuestion === candidate.question
                    ? '✓ Selected'
                    : t('unitBuilder.drivingQuestion.selectAsMain')}
                </button>
              </div>
            </div>
          </div>
        ))}

        {drivingQuestion.candidates.length < 3 && (
          <button
            type="button"
            onClick={addCandidate}
            className="btn-secondary w-full"
          >
            + {t('unitBuilder.drivingQuestion.addCandidate')}
          </button>
        )}
      </div>

      {/* Selected Question Display */}
      {drivingQuestion.selectedQuestion && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-medium text-blue-700 mb-2">
            {t('student.workspace.drivingQuestion')}:
          </h3>
          <p className="text-lg font-semibold text-blue-900">
            {drivingQuestion.selectedQuestion}
          </p>
        </div>
      )}
    </div>
  )
}
