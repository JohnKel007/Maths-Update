'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

// LOGIN DISABLED TEMPORARILY — restore useSession and auth checks to re-enable
export default function Home() {
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    // Bypass authentication — redirect directly to teacher view
    router.push('/teacher/unit-builder')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ikigai-primary mb-2">
          {t('common.appName')}
        </h1>
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    </div>
  )
}
