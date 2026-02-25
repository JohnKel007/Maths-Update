'use client'

import { useI18n } from '@/lib/i18n'

const PHASES = [
  { key: 'notice', number: 1, colorClass: 'bg-amber-500', borderClass: 'border-amber-500' },
  { key: 'explore', number: 2, colorClass: 'bg-emerald-500', borderClass: 'border-emerald-500' },
  { key: 'investigate', number: 3, colorClass: 'bg-blue-500', borderClass: 'border-blue-500' },
  { key: 'construct', number: 4, colorClass: 'bg-violet-500', borderClass: 'border-violet-500' },
  { key: 'share', number: 5, colorClass: 'bg-pink-500', borderClass: 'border-pink-500' },
] as const

interface PhaseTrackerProps {
  currentPhase: number
  completedPhases: number[]
  onPhaseClick?: (phase: number) => void
  compact?: boolean
}

export function PhaseTracker({
  currentPhase,
  completedPhases,
  onPhaseClick,
  compact = false,
}: PhaseTrackerProps) {
  const { t } = useI18n()

  return (
    <div className="w-full">
      <div className={`flex ${compact ? 'gap-2' : 'gap-4'} items-center`}>
        {PHASES.map((phase, index) => {
          const isCompleted = completedPhases.includes(phase.number)
          const isCurrent = currentPhase === phase.number
          const isAccessible = isCompleted || isCurrent

          return (
            <div key={phase.key} className="flex items-center flex-1">
              <button
                onClick={() => isAccessible && onPhaseClick?.(phase.number)}
                disabled={!isAccessible}
                className={`
                  flex flex-col items-center gap-1 w-full p-2 rounded-lg transition-all
                  ${isCurrent ? `${phase.borderClass} border-2 bg-white shadow-md` : ''}
                  ${isCompleted ? 'opacity-100' : !isCurrent ? 'opacity-40' : ''}
                  ${isAccessible ? 'cursor-pointer hover:shadow-sm' : 'cursor-not-allowed'}
                `}
                aria-label={t(`phases.${phase.key}`)}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={`
                    ${compact ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'}
                    rounded-full flex items-center justify-center font-bold text-white
                    ${phase.colorClass}
                    ${isCompleted ? 'ring-2 ring-offset-2 ring-green-400' : ''}
                  `}
                >
                  {isCompleted ? '✓' : phase.number}
                </div>
                {!compact && (
                  <span className="text-xs font-medium text-center leading-tight">
                    {t(`phases.${phase.key}`)}
                  </span>
                )}
              </button>
              {index < PHASES.length - 1 && (
                <div
                  className={`h-0.5 flex-shrink-0 w-4 ${
                    completedPhases.includes(phase.number)
                      ? phase.colorClass
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
