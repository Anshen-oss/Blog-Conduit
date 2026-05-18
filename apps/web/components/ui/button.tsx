import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'outline-danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        // Base
        'inline-flex items-center justify-center gap-2 font-semibold rounded transition-colors cursor-pointer',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        // Tailles
        size === 'sm' && 'px-3 py-1 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        // Variantes
        variant === 'primary' && 'bg-brand text-white hover:bg-brand-hover',
        variant === 'outline' && 'border border-brand text-brand bg-transparent hover:bg-brand hover:text-white',
        variant === 'outline-danger' && 'border border-danger text-danger bg-transparent hover:bg-danger hover:text-white',
        variant === 'ghost' && 'text-conduit-gray hover:text-conduit-text bg-transparent',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
