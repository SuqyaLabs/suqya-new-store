import { Metadata } from "next";
import { Mountain, Heart, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Notre Histoire - Suqya Miel Bio | سُقيا",
  description:
    "Découvrez l'histoire de Suqya, votre source de miel bio authentique d'Algérie. Du rucher à votre table.",
};

const milestones = [
  {
    year: "2020",
    title: "Les débuts",
    description:
      "Première récolte dans les montagnes d'Algérie. Une passion familiale devient un projet.",
  },
  {
    year: "2022",
    title: "Expansion",
    description:
      "Partenariat avec 10 apiculteurs locaux. Certification bio obtenue.",
  },
  {
    year: "2024",
    title: "Suqya est né",
    description:
      "Lancement de la boutique en ligne pour partager notre miel avec toute l'Algérie.",
  },
  {
    year: "2025",
    title: "Aujourd'hui",
    description:
      "Plus de 500 clients satisfaits et une communauté grandissante d'amateurs de miel.",
  },
];

const values = [
  {
    icon: Mountain,
    title: "Origine",
    description:
      "Tout notre miel provient des montagnes algériennes, loin de toute pollution.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Chaque pot est le fruit du travail passionné de nos apiculteurs partenaires.",
  },
  {
    icon: Users,
    title: "Communauté",
    description:
      "Nous soutenons les apiculteurs locaux et leurs familles.",
  },
  {
    icon: Award,
    title: "Qualité",
    description:
      "Aucun compromis sur la qualité. 100% pur, 100% naturel.",
  },
];

export default function NotreHistoirePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-warm-50 to-warm-100 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <span className="text-5xl mb-6 block">🐝</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            Suqya, c&apos;est l&apos;histoire d&apos;une passion pour le miel authentique 
            et d&apos;un engagement envers la qualité et la tradition.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-warm-900 mb-8 text-center">
              Du rucher à votre table
            </h2>
            <div className="prose prose-lg text-warm-600 mx-auto">
              <p>
                Tout a commencé dans les montagnes d'Algérie, où notre famille 
                pratique l&apos;apiculture depuis trois générations. Le miel faisait 
                partie de notre quotidien, un trésor que nous partagions avec 
                nos proches.
              </p>
              <p>
                Face à la difficulté de trouver du miel authentique sur le marché, 
                nous avons décidé de créer <strong>Suqya</strong> (سُقيا) - un mot 
                arabe qui signifie &quot;nourrir&quot; ou &quot;abreuver&quot;. Notre mission : 
                apporter le meilleur du miel algérien directement chez vous.
              </p>
              <p>
                Aujourd&apos;hui, nous travaillons avec plus de 10 apiculteurs 
                partenaires dans différentes régions d&apos;Algérie, chacun apportant 
                son savoir-faire unique et ses variétés de miel exceptionnelles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-warm-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            Notre parcours
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-honey-600 text-warm-900 font-bold flex items-center justify-center text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-honey-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold text-warm-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-warm-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-warm-900 mb-12 text-center">
            Nos valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-6 rounded-2xl bg-warm-50"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-honey-100 text-honey-700 mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-warm-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-warm-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-linear-to-br from-honey-500 to-honey-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-6">
            Prêt à goûter la différence ?
          </h2>
          <p className="text-warm-800 mb-8 max-w-xl mx-auto">
            Découvrez notre sélection de miels bio et laissez-vous surprendre 
            par la qualité du miel algérien authentique.
          </p>
          <a
            href="/boutique"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-warm-900 text-white font-semibold hover:bg-warm-800 transition-colors"
          >
            Découvrir nos miels
          </a>
        </div>
      </section>
    </div>
  );
}
