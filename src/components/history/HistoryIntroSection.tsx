
import React from "react";
import { Separator } from "@/components/ui/separator";

interface HistoryIntroSectionProps {
  imageUrl?: string;
  title?: string;
  description?: string;
}

const HistoryIntroSection: React.FC<HistoryIntroSectionProps> = ({
  imageUrl = "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png",
  title = "Notre Histoire",
  description = "Côté Sud Immobilier vous accompagne dans tous vos projets immobiliers depuis plus de 15 ans. Notre expertise du marché local et notre connaissance approfondie de la région nous permettent de vous offrir un service personnalisé et de qualité. Notre équipe de professionnels est à votre écoute pour vous guider dans votre recherche et vous accompagner jusqu'à la concrétisation de votre projet."
}) => {
  return (
    <section className="py-12 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-sable text-center mb-6">
          {title}
        </h2>
        <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mb-12" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <div className="md:w-1/3">
            <div className="rounded-full overflow-hidden w-64 h-64 mx-auto border border-sable/10">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Notre Agence" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-sable/10 flex items-center justify-center text-sable">
                  Notre Agence
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-2/3 mt-6 md:mt-0">
            <p className="text-base leading-relaxed text-anthracite">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryIntroSection;
