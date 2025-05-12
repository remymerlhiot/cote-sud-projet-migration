
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AutoplayPlugin from "embla-carousel-autoplay";

const AgenceSection = () => {
  // Images de l'agence avec leur description et URLs mises à jour
  const agenceImages = [{
    url: "https://cote-sud.immo/wp-content/uploads/2025/05/agence-0-min-scaled.jpg",
    alt: "Agence AXO Côté Sud - Extérieur"
  }, {
    url: "https://cote-sud.immo/wp-content/uploads/2025/05/agence-2-min-scaled.jpg",
    alt: "Agence AXO Côté Sud - Intérieur lumineux"
  }, {
    url: "https://cote-sud.immo/wp-content/uploads/2025/05/agence-3-min-scaled.jpg",
    alt: "Agence AXO Côté Sud - Façade"
  }];

  // Configuration du plugin d'autoplay pour le carousel de l'agence
  const autoplayOptions = {
    delay: 4000, // 4 secondes entre chaque slide
    stopOnInteraction: true,
    stopOnMouseEnter: true,
    rootNode: (emblaRoot: any) => emblaRoot.parentElement,
  };

  return <section className="py-16 bg-sable-30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-['FreightBig Pro', serif] text-3xl md:text-4xl text-cuivre mb-3">
            Notre Agence
          </h2>
          <div className="w-24 h-1 bg-sable mx-auto mb-6"></div>
          <p className="text-anthracite text-lg max-w-2xl mx-auto">
            Découvrez notre espace dédié à l'immobilier de prestige dans le Sud de la France. 
            Un lieu chaleureux où nous vous accompagnons dans tous vos projets immobiliers.
          </p>
        </div>

        {/* Carousel des images de l'agence avec bordure dorée et défilement automatique */}
        <div className="max-w-5xl mx-auto">
          <Carousel 
            className="w-full"
            opts={{
              align: "center",
              loop: true
            }}
            plugins={[AutoplayPlugin(autoplayOptions)]}
          >
            <CarouselContent>
              {agenceImages.map((image, index) => <CarouselItem key={index} className="md:basis-2/3 lg:basis-3/4">
                  <div className="p-2">
                    <div className="overflow-hidden rounded-md border-4 border-sable aspect-[16/9] relative">
                      <img src={image.url} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" onError={e => {
                    console.error(`Erreur de chargement d'image: ${image.url}`);
                    // Utilisation du placeholder comme fallback
                    e.currentTarget.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                  }} />
                    </div>
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="bg-white/70 hover:bg-white text-sable border-sable" />
            <CarouselNext className="bg-white/70 hover:bg-white text-sable border-sable" />
          </Carousel>
        </div>

        <div className="max-w-xl mx-auto mt-10 text-center text-anthracite">
          
          
        </div>
      </div>
    </section>;
};
export default AgenceSection;
