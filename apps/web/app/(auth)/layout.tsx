// Layout pour les pages d'authentification
// Pas de Header ni Footer — juste le contenu centré

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // Le contenu occupe toute la page, centré verticalement si besoin
    <main>{children}</main>
  );
}
