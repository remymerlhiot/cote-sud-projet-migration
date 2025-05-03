
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useCustomPage } from "@/hooks/useCustomPage";

const DifferenceSection = () => {
  // Fetch homepage content
  const { data: homePage } = useCustomPage("new-home");

  return (
    <section className="container mx-auto mb-20 px-4">
      <h2 className="text-2xl md:text-3xl font-playfair font-normal text-[#CD9B59] text-center mb-12">
        LA DIFFÉRENCE
      </h2>
      
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="md:w-1/3">
          <div className="overflow-hidden rounded-full">
            <img 
              src={homePage?.featured_image || "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"}
              alt="AXO Côté Sud - La différence" 
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="md:w-2/3">
          <p className="text-gray-700 mb-4">
            AXO Côté Sud, réseau d'agences spécialisées en commercialisation de biens immobiliers d'exception, s'adresse aux clients à la recherche de leur lieu de vie idéal au cœur du Sud de la France.
          </p>
          <p className="text-gray-700 mb-8">
            Notre équipe composée d'experts du secteur immobilier, vous accompagne tout au long de votre projet, des premières étapes de recherche jusqu'à la concrétisation de votre projet immobilier que vous souhaitiez devenir locataire ou bien propriétaire.
          </p>
          
          <h3 className="text-2xl font-playfair font-normal text-[#CD9B59] mb-6">
            L'ACCOMPAGNEMENT
          </h3>
          
          <p className="text-gray-700 mb-6">
            Anticipation, des actions, des prestations, maîtrise des dossiers, professionnalisme, des connaissances, disponibilité et réactivité. Autant d'adjectifs qui vous permettront de vous rassurer dans votre projet, d'avoir une écoute face à vos questionnements, de recevoir des conseils avisés et d'être soutenu dans vos démarches.
          </p>
          
          <Button variant="outline" className="border-[#CD9B59] text-[#CD9B59] hover:bg-[#CD9B59] hover:text-white">
            EN SAVOIR PLUS <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DifferenceSection;
