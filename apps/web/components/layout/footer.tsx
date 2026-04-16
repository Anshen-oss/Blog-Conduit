// Footer statique de Conduit

import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <div className="container">
        <Link className="logo-font" href="/">
          Anshen Blog
        </Link>
        <span className="attribution">
          An interactive learning project from{' '}
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  );
}
