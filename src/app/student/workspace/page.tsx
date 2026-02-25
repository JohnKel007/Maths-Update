'use client'

import { useI18n } from '@/lib/i18n'
import { PhaseTracker } from '@/components/ui/PhaseTracker'

export default function StudentWorkspacePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gray-50 student-view">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-student-heading font-bold text-gray-900">
            {t('student.workspace.title')}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Driving Question — always visible */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-blue-200 mb-1">
            {t('student.workspace.drivingQuestion')}
          </p>
          <p className="text-xl font-bold">
            How much water does our school waste each week, and what would it cost to fix?
          </p>
        </div>

        {/* Phase Tracker */}
        <PhaseTracker
          currentPhase={1}
          completedPhases={[]}
          onPhaseClick={() => {}}
        />

        {/* Phase Content */}
        <div className="card text-center py-16">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            Module 2 — Student Inquiry Workspace
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            The five-phase student workspace (NOTICE, EXPLORE, INVESTIGATE,
            CONSTRUCT, SHARE & REFLECT) will be built in Phase B. The Unit Builder
            must be completed first so teachers can set up units for students.
          </p>
        </div>
      </main>
    </div>
  )
}
