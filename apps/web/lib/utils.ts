import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine des classes Tailwind avec résolution des conflits.
 * Exemple : cn('px-2', condition && 'px-4') → 'px-4' si condition = true
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
