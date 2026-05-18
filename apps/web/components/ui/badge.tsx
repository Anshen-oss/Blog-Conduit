import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
  onClick?: () => void
}

export function Badge({ children, variant = 'default', className, onClick }: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-block px-2 py-0.5 text-xs rounded-sm cursor-pointer transition-colors',
        variant === 'default' && 'bg-conduit-gray text-white hover:bg-conduit-text',
        variant === 'outline' && 'border border-conduit-border text-conduit-gray hover:bg-conduit-gray-light',
        className,
      )}
    >
      {children}
    </span>
  )
}
