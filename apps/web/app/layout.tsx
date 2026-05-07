import type { Metadata } from 'next';
import { Merriweather, Source_Sans_3, Titillium_Web } from 'next/font/google';
import './globals.css';

// ✅ Next.js gère le chargement et l'optimisation des fonts
const titillium = Titillium_Web({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-titillium',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Blog',
    template: '%s — Anshen Blog',
  },
  description: 'A place to share knowledge. Built with NestJS & Next.js.',
  openGraph: {
    siteName: 'Anshen Blog',
    type: 'website',
    locale: 'fr_FR',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002'),
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${titillium.variable} ${sourceSans.variable} ${merriweather.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
