'use client'

interface WarningBannerProps {
  message: string
  show: boolean
}

export function WarningBanner({ message, show }: WarningBannerProps) {
  if (!show) return null

  return (
    <div
      className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
      role="alert"
    >
      <span className="text-amber-600 text-xl flex-shrink-0" aria-hidden="true">
        ⚠
      </span>
      <p className="text-sm text-amber-800">{message}</p>
    </div>
  )
}
