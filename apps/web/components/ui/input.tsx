import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className, id, ...props }, ref) => {
    return (
      <fieldset className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-conduit-gray">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            // Base
            'w-full px-4 py-3 text-lg border rounded transition-colors outline-none',
            // État normal
            'border-conduit-border text-conduit-text placeholder:text-conduit-muted',
            // Focus
            'focus:border-brand focus:ring-1 focus:ring-brand',
            // Erreur
            error && 'border-danger focus:border-danger focus:ring-danger',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
      </fieldset>
    )
  }
)

Input.displayName = 'Input'
