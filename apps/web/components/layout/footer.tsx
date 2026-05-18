import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-conduit-border bg-conduit-gray-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-brand font-bold hover:text-brand-hover transition-colors"
        >
          conduit
        </Link>
        <span className="text-conduit-muted">
          An interactive learning project from{' '}
          <a
            href="https://thinkster.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Thinkster
          </a>
          . Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  )
}
