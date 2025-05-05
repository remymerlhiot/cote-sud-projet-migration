
import React, { useState, useEffect } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";
import { useCustomPage } from "@/hooks/useCustomPage";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanElementorHtml } from "@/utils/elementorCleaner";

type ServiceItem = {
  id: string;
  title: string;
  content: string;
};

const ServicesSection = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const { data: pageData, isLoading } = useCustomPage("services");

  useEffect(() => {
    if (pageData?.content) {
      // Extract services from WordPress content
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanElementorHtml(pageData.content), "text/html");
      
      // Look for service titles (h3 elements with specific class or content)
      const serviceTitles = Array.from(doc.querySelectorAll("h3"));
      
      const extractedServices: ServiceItem[] = [];
      
      serviceTitles.forEach((title, index) => {
        // Get the title text
        const titleText = title.textContent?.trim() || `Service ${index + 1}`;
        
        // Get the content - usually the next paragraph or div after the title
        let contentElement = title.nextElementSibling;
        let contentText = "";
        
        // If we found content element, get its text
        if (contentElement) {
          contentText = contentElement.textContent?.trim() || "";
          
          // Check if there are multiple paragraphs
          while (contentElement?.nextElementSibling && 
                 contentElement.nextElementSibling.tagName !== "H3") {
            contentElement = contentElement.nextElementSibling;
            contentText += " " + (contentElement.textContent?.trim() || "");
          }
        }
        
        // Create service item
        if (titleText) {
          extractedServices.push({
            id: titleText.toLowerCase().replace(/\s+/g, "-"),
            title: titleText,
            content: contentText || "Contenu à venir"
          });
        }
      });
      
      // If no services were found in the content, use default services
      if (extractedServices.length === 0) {
        setServices([
          {
            id: "estimation",
            title: "L'ESTIMATION",
            content: "Nous réalisons un rapport détaillé du bien et déterminons sa valeur après une analyse géographique et de marché pour optimiser le prix de vente et obtenir le prix juste du bien."
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
        ]);
      } else {
        setServices(extractedServices);
      }
    }
  }, [pageData]);

  return (
    <section className="relative mb-20">
      <div className="w-full h-[600px] bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png')" }}>
        <div className="absolute inset-0 bg-black/60">
          <div className="container mx-auto h-full flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 text-center md:text-left p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-normal text-[#CD9B59] mb-6">
                SERVICES DE L'AGENCE
              </h2>
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full bg-white/10" />
                  <Skeleton className="h-10 w-full bg-white/10" />
                  <Skeleton className="h-10 w-full bg-white/10" />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
