
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

type ServiceSectionProps = {
  className?: string;
};

const ServiceSection = ({ className }: ServiceSectionProps) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const { data: pageData, isLoading } = useCustomPage("new-home");

  useEffect(() => {
    if (pageData?.content) {
      // Extract services from WordPress content
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanElementorHtml(pageData.content), "text/html");
      
      // Look for the services section
      const servicesSection = doc.querySelector(".services-section, #services-section, section:has(h2:contains('SERVICES'))");
      
      let extractedServices: ServiceItem[] = [];
      
      if (servicesSection) {
        // Look for service titles within the services section
        const serviceTitles = Array.from(servicesSection.querySelectorAll("h3, .service-title, .elementor-heading-title"));
        
        serviceTitles.forEach((title, index) => {
          // Get the title text
          const titleText = title.textContent?.trim() || `Service ${index + 1}`;
          
          // Get the content
          let contentElement = title.nextElementSibling;
          let contentText = "";
          
          if (contentElement) {
            contentText = contentElement.textContent?.trim() || "";
            
            while (contentElement?.nextElementSibling && 
                  contentElement.nextElementSibling.tagName !== "H3" && 
                  !contentElement.nextElementSibling.classList.contains("service-title") &&
                  !contentElement.nextElementSibling.classList.contains("elementor-heading-title")) {
              contentElement = contentElement.nextElementSibling;
              if (contentElement.textContent?.trim()) {
                contentText += " " + (contentElement.textContent?.trim() || "");
              }
            }
          }
          
          if (titleText && contentText) {
            extractedServices.push({
              id: titleText.toLowerCase().replace(/\s+/g, "-"),
              title: titleText,
              content: contentText
            });
          }
        });
      }
      
      // Remove duplicates
      extractedServices = extractedServices.filter((service, index, self) =>
        index === self.findIndex((s) => s.id === service.id)
      );
      
      // If we found services, use them; otherwise use default services
      if (extractedServices.length > 0) {
        setServices(extractedServices);
      } else {
        // Default services
        setServices([
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
        ]);
      }
    }
  }, [pageData]);

  return (
    <section 
      className={`relative w-full mb-20 ${className}`}
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://cote-sud.immo/wp-content/uploads/2024/11/champs-de-lavandes-sur-sainte-victoire.jpg')",
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
    </section>
  );
};

export default ServiceSection;
