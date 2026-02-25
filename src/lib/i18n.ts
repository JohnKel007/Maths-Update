'use client'

import { createContext, useContext } from 'react'
import esStrings from '@/../public/locales/es.json'
import enStrings from '@/../public/locales/en.json'

export type Locale = 'es' | 'en'

const strings: Record<Locale, typeof esStrings> = {
  es: esStrings,
  en: enStrings,
}

export interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: string) => string
}

export const I18nContext = createContext<I18nContextType>({
  locale: 'es',
  setLocale: () => {},
  t: (path: string) => path,
})

export function useI18n() {
  return useContext(I18nContext)
}

export function getTranslation(locale: Locale, path: string): string {
  const keys = path.split('.')
  let current: unknown = strings[locale]

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // Return the key path as fallback
    }
  }

  return typeof current === 'string' ? current : path
}
