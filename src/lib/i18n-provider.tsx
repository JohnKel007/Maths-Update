'use client'

import { useState, useCallback, ReactNode } from 'react'
import { I18nContext, Locale, getTranslation } from './i18n'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')

  const t = useCallback(
    (path: string) => getTranslation(locale, path),
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}
