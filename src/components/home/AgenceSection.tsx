
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const AgenceSection = () => {
  // Images de l'agence avec leur description
  const agenceImages = [
    {
      url: "/lovable-uploads/9cb82054-03c1-47e4-ba52-6db0c77f553e.jpg",
      alt: "Agence AXO Côté Sud - Extérieur",
    },
    {
      url: "/lovable-uploads/e108c0db-41de-4c53-89b3-0d17e6d42b7e.jpg",
      alt: "Agence AXO Côté Sud - Intérieur lumineux",
    },
    {
      url: "/lovable-uploads/f50f327c-b2d4-4733-925b-a275f7f726f9.jpg",
      alt: "Agence AXO Côté Sud - Bureau d'accueil",
    },
    {
      url: "/lovable-uploads/6d3152f4-9d6d-4ffe-9e6b-386b66ef9495.jpg",
      alt: "Agence AXO Côté Sud - Façade",
    }
  ];

  return (
    <section className="py-16 bg-sable-30">
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

        {/* Carousel des images de l'agence avec bordure dorée */}
        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {agenceImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-2/3 lg:basis-3/4">
                  <div className="p-2">
                    <div 
                      className="overflow-hidden rounded-md border-4 border-sable aspect-[16/9] relative"
                    >
                      <img 
                        src={image.url} 
                        alt={image.alt} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/70 hover:bg-white text-sable border-sable" />
            <CarouselNext className="bg-white/70 hover:bg-white text-sable border-sable" />
          </Carousel>
        </div>

        <div className="max-w-xl mx-auto mt-10 text-center text-anthracite">
          <p className="mb-5">
            Située au cœur de la région Sud, notre agence AXO Côté Sud allie expertise immobilière et connaissance approfondie du marché local pour vous offrir un service immobilier d'exception.
          </p>
          <address className="not-italic">
            <strong className="font-medium text-cuivre">AXO Côté Sud</strong><br />
            123 Avenue des Palmiers<br />
            83140 Six-Fours-les-Plages<br />
            <a href="tel:0609080498" className="text-cuivre hover:underline">06 09 08 04 98</a>
          </address>
        </div>
      </div>
    </section>
  );
};

export default AgenceSection;
