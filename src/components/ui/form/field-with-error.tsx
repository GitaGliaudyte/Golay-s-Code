import * as React from 'react'

type Props = {
  label: string
  value?: string
  onChange?: (v: string) => void
  errorMessage?: string | null
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  children?: React.ReactNode
}

export function FieldWithError({ label, value, onChange, errorMessage, inputProps, textareaProps, children }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      {React.Children.count(children) > 0 ? (
        children
      ) : textareaProps ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1 block w-full rounded border px-2 py-1"
          {...textareaProps}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1 block w-full rounded border px-2 py-1"
          {...inputProps}
        />
      )}
      {errorMessage ? (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  )
}

export default FieldWithError
