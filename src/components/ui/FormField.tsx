'use client'

import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

export function FormField({ label, required, hint, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="label-text">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
