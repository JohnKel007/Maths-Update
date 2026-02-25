'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = session.user.role
      if (role === 'teacher') {
        router.push('/teacher/unit-builder')
      } else if (role === 'student') {
        router.push('/student/workspace')
      } else if (role === 'admin') {
        router.push('/admin/phenomenon-library')
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [session, status, router])

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
