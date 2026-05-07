// Root layout — enveloppe toute l'application
// C'est le seul endroit où <html> et <body> sont définis

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Blog',           // Affiché si la page ne définit pas de titre
    template: '%s — Anshen Blog',     // Ex: "Mon article — Conduit"
  },
  description: 'A place to share knowledge. Built with NestJS & Next.js.',
  openGraph: {
    siteName: 'Anshen Blog',
    type: 'website',
    locale: 'fr_FR',
  },
  // Indique aux moteurs de recherche l'URL canonique du site
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'),
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
<head>
  <link
    rel="stylesheet"
    href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
  />
  <link
    rel="stylesheet"
    href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
  />
  <link rel="stylesheet" href="https://demo.realworld.io/main.css" />
</head>
      <body>{children}</body>
    </html>
  );
}
