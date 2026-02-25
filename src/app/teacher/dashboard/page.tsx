'use client'

import { useI18n } from '@/lib/i18n'

export default function TeacherDashboardPage() {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t('nav.classDashboard')}
      </h1>

      <div className="card text-center py-16">
        <h2 className="text-lg font-medium text-gray-600 mb-2">
          Module 3 — Teacher Dashboard
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The class overview, phase progress tracker, assessment tracker, and
          facilitation tools will be built in Phase C. First, complete the Unit
          Builder and Student Workspace.
        </p>
      </div>
    </div>
  )
}
