'use client'

interface CheckboxItemProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
}

export function CheckboxItem({ label, checked, onChange, id }: CheckboxItemProps) {
  return (
    <label
      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer
                 hover:bg-gray-50 transition-colors"
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 rounded border-gray-300 text-ikigai-primary
                   focus:ring-ikigai-primary cursor-pointer"
      />
      <span className="text-sm text-gray-700 leading-relaxed">{label}</span>
    </label>
  )
}
