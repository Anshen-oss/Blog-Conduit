// Root layout — enveloppe toute l'application
// C'est le seul endroit où <html> et <body> sont définis

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conduit',
  description: 'A place to share your knowledge.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Feuille de style officielle du projet RealWorld/Conduit */}
        <link
          rel="stylesheet"
          href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
        />
        <link
          rel="stylesheet"
          href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
        />
        <link rel="stylesheet" href="//demo.productionready.io/main.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
