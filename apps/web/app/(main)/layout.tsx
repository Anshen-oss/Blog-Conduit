// Layout pour toutes les pages "principales"
// Applique automatiquement Header + Footer à homepage, articles, profils, etc.

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {/* Header async : récupère l'utilisateur courant côté serveur */}
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
