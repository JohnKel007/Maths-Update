'use client'

import { useI18n } from '@/lib/i18n'

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                 text-gray-600 hover:bg-gray-100 transition-colors"
      aria-label={t('common.language')}
    >
      <span className="text-base">{locale === 'es' ? '🇲🇽' : '🇬🇧'}</span>
      <span>{locale === 'es' ? 'ES' : 'EN'}</span>
    </button>
  )
}
