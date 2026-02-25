'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useI18n } from '@/lib/i18n'
import { LanguageToggle } from '@/components/ui/LanguageToggle'

const teacherNav = [
  { href: '/teacher/unit-builder', labelKey: 'nav.unitBuilder' },
  { href: '/teacher/phenomenon-library', labelKey: 'nav.phenomenonLibrary' },
  { href: '/teacher/dashboard', labelKey: 'nav.classDashboard' },
]

export function TeacherLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/teacher/unit-builder" className="font-bold text-ikigai-primary text-lg">
                {t('common.appName')}
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {teacherNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'bg-blue-50 text-ikigai-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <span className="text-sm text-gray-500 hidden sm:block">
                {session?.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
              >
                {t('common.signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
