import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-8xl mb-6 block">🍯</span>
        <h1 className="text-4xl font-bold text-warm-900 mb-4">
          Page non trouvée
        </h1>
        <p className="text-warm-500 mb-8 max-w-md mx-auto">
          Oups ! Cette page n&apos;existe pas ou a été déplacée. 
          Retournez à l&apos;accueil ou explorez notre boutique.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home size={18} />
              Retour à l&apos;accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/boutique" className="gap-2">
              <ShoppingBag size={18} />
              Voir la boutique
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
