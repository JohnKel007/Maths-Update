'use client'

import { useI18n } from '@/lib/i18n'

const STAGES = [
  { key: 'setup', number: 0 },
  { key: 'phenomenon', number: 1 },
  { key: 'mathsMapping', number: 2 },
  { key: 'drivingQuestion', number: 3 },
  { key: 'learningArc', number: 4 },
  { key: 'digitalTools', number: 5 },
  { key: 'assessment', number: 6 },
  { key: 'facilitation', number: 7 },
] as const

interface StageProgressProps {
  currentStage: number
  completedStages: number[]
  onStageClick?: (stage: number) => void
}

export function StageProgress({
  currentStage,
  completedStages,
  onStageClick,
}: StageProgressProps) {
  const { t } = useI18n()

  return (
    <nav aria-label="Unit Builder Progress" className="w-full">
      <ol className="flex flex-wrap gap-1">
        {STAGES.map((stage) => {
          const isCompleted = completedStages.includes(stage.number)
          const isCurrent = currentStage === stage.number
          const isAccessible = isCompleted || isCurrent || completedStages.includes(stage.number - 1)

          return (
            <li key={stage.key} className="flex-1 min-w-[100px]">
              <button
                onClick={() => isAccessible && onStageClick?.(stage.number)}
                disabled={!isAccessible}
                className={`
                  w-full px-3 py-2 text-xs font-medium rounded-md transition-all text-center
                  ${isCurrent ? 'bg-ikigai-primary text-white shadow-sm' : ''}
                  ${isCompleted ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                  ${!isCurrent && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                  ${isAccessible && !isCurrent ? 'cursor-pointer' : ''}
                  ${!isAccessible ? 'cursor-not-allowed' : ''}
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {stage.number > 0 && (
                  <span className="mr-1">{isCompleted ? '✓' : `${stage.number}.`}</span>
                )}
                {t(`unitBuilder.stages.${stage.key}`)}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
