import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  username: string
  size?: number
  className?: string
}

export function Avatar({ src, username, size = 32, className = '' }: AvatarProps) {
  if (!src) {
    return (
      <div
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        className={`rounded-full bg-brand flex items-center justify-center text-white font-bold shrink-0 ${className}`}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={username}
      width={size}
      height={size}
      unoptimized
      className={`rounded-full object-cover shrink-0 ${className}`}
    />
  )
}
