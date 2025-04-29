
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";

type ServiceItemProps = {
  id: string;
  title: string;
  content: string;
};

type ServiceSectionProps = {
  className?: string;
};

const ServiceSection = ({ className }: ServiceSectionProps) => {
  // Services de l'agence data
  const services: ServiceItemProps[] = [
    {
      id: "estimation",
      title: "L'ESTIMATION",
      content: "Nous prenons un soin particulier à établir et déterminer la valeur précise du bien, grâce à notre forte connaissance du marché local et des méthodes d'évaluation différentes, afin d'obtenir le juste prix du bien."
    },
    {
      id: "diffusion",
      title: "UNE DIFFUSION CIBLÉE",
      content: "Nous mettons en place une stratégie de communication efficace pour promouvoir votre bien auprès des acheteurs potentiels. Notre diffusion ciblée inclut notre réseau de clients qualifiés, notre site internet et les plateformes immobilières de référence."
    },
    {
      id: "offre",
      title: "L'OFFRE D'ACHAT",
      content: "Nous vous accompagnons dans la négociation et la validation des offres d'achat, en vous conseillant sur les conditions suspensives et en sécurisant l'ensemble de la transaction jusqu'à la signature définitive chez le notaire."
    }
  ];

  return (
    <section 
      className={`relative w-full mb-20 ${className}`}
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/lovable-uploads/df0b0336-49ea-44d1-aa0b-f32ef78fa759.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-light text-[#CD9B59] text-center mb-12">
          SERVICES DE L'AGENCE
        </h2>
        
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 lg:w-2/5">
            <Accordion type="single" collapsible className="bg-[#2A2B31]/90 rounded-md p-4">
              {services.map((service) => (
                <AccordionItem 
                  key={service.id} 
                  value={service.id} 
                  className="border-b border-[#CD9B59]/30 last:border-0"
                >
                  <AccordionTrigger className="text-[#CD9B59] hover:no-underline py-4 flex justify-between">
                    <span>{service.title}</span>
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 shrink-0 text-[#CD9B59] transition-all group-data-[state=open]:hidden" />
                      <Minus className="h-4 w-4 shrink-0 text-[#CD9B59] transition-all hidden group-data-[state=open]:block" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white animate-accordion-down">
                    <div className="pt-2 pb-4">
                      {service.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
