
import React from "react";
import { Separator } from "@/components/ui/separator";

interface HistoryIntroSectionProps {
  imageUrl?: string;
  title?: string;
  description?: string;
}

const HistoryIntroSection: React.FC<HistoryIntroSectionProps> = ({
  imageUrl = "https://cote-sud.immo/wp-content/uploads/2024/11/maison-cezanne.png",
  title = "Notre Histoire",
  description = "Côté Sud Immobilier vous accompagne dans tous vos projets immobiliers depuis plus de 15 ans. Notre expertise du marché local et notre connaissance approfondie de la région nous permettent de vous offrir un service personnalisé et de qualité. Notre équipe de professionnels est à votre écoute pour vous guider dans votre recherche et vous accompagner jusqu'à la concrétisation de votre projet."
}) => {
  return (
    <section className="py-12 bg-sable-30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-cuivre text-center mb-6">
          {title}
        </h2>
        <Separator className="w-24 h-0.5 bg-sable mx-auto mb-12" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden w-full h-auto border border-sable/10 shadow-md">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Maison Cezanne" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-sable/10 flex items-center justify-center text-sable">
                  Notre Agence
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 mt-6 md:mt-0 space-y-6">
            <div>
              <h3 className="text-xl md:text-2xl font-playfair text-cuivre mb-2">
                "Spécialisés dans l'immobilier de Prestige"
              </h3>
              <p className="text-base text-anthracite">
                Nous proposons une expertise locale conjuguée à la puissance d'un réseau national de qualité
              </p>
            </div>
            
            <blockquote className="pl-4 border-l-2 border-sable italic">
              <p className="text-sm md:text-base text-anthracite leading-relaxed">
                "C'est avant tout une rencontre humaine et des valeurs partagées avec Pierre-Nelson, le président du Réseau AXO, pour la création de la première agence de Prestige à Aix-en-Provence. Nous plaçons la relation humaine et le professionnalisme au centre de nos préoccupations. Fort d'un important relationnel, nous accompagnons et facilitons la recherche, en répondant au mieux aux attentes. Nous instaurons une relation de confiance et nous prenons un soin particulier à valider avec les propriétaires les reportages photos et vidéo, l'annonce et la diffusion du bien. Nos valeurs : l'intégrité, l'exigence et la confidentialité."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryIntroSection;
