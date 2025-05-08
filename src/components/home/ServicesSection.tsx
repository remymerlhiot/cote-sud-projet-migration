import React, { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  const [backgroundImage, setBackgroundImage] = useState<string>("https://cote-sud.immo/wp-content/uploads/2024/11/champs-de-lavandes-sur-sainte-victoire.jpg");
  const {
    data: pageData,
    isLoading
  } = useCustomPage("new-home");
  useEffect(() => {
    if (pageData?.content) {
      // Extract services and background image from WordPress content
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanElementorHtml(pageData.content), "text/html");

      // Look for background image in the services section
      extractBackgroundImage(doc);

      // Look for the services section (using standard selectors)
      const servicesSection = doc.querySelector(".services-section") || doc.querySelector("#services-section") || findServicesSectionByHeading(doc);
      let extractedServices: ServiceItem[] = [];
      if (servicesSection) {
        // Look for service titles within the services section
        const serviceTitles = Array.from(servicesSection.querySelectorAll("h3, .service-title, .elementor-heading-title"));
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
            while (contentElement?.nextElementSibling && contentElement.nextElementSibling.tagName !== "H3" && !contentElement.nextElementSibling.classList.contains("service-title") && !contentElement.nextElementSibling.classList.contains("elementor-heading-title")) {
              contentElement = contentElement.nextElementSibling;
              if (contentElement.textContent?.trim()) {
                contentText += " " + (contentElement.textContent?.trim() || "");
              }
            }
          }

          // Create service item if we have both title and content
          if (titleText && contentText) {
            extractedServices.push({
              id: titleText.toLowerCase().replace(/\s+/g, "-"),
              title: titleText,
              content: contentText
            });
          }
        });
      } else {
        // If no specific services section found, try to find service-like content in the whole document
        // Look for patterns like "L'ESTIMATION", "UNE DIFFUSION CIBLÉE", etc.
        const potentialServiceTitles = ["L'ESTIMATION", "UNE DIFFUSION", "DIFFUSION", "L'OFFRE", "OFFRE D'ACHAT"];
        potentialServiceTitles.forEach(serviceTitle => {
          // Find elements containing this text
          const elements = Array.from(doc.querySelectorAll("*")).filter(el => el.textContent?.includes(serviceTitle));
          elements.forEach(element => {
            const titleText = element.textContent?.trim() || "";
            let contentElement = element.nextElementSibling;
            let contentText = "";
            if (contentElement) {
              contentText = contentElement.textContent?.trim() || "";

              // Try to get more content if available
              while (contentElement?.nextElementSibling && !potentialServiceTitles.some(title => contentElement?.nextElementSibling?.textContent?.includes(title) || false)) {
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
        });
      }

      // Remove any duplicate services (by id)
      extractedServices = extractedServices.filter((service, index, self) => index === self.findIndex(s => s.id === service.id));

      // If we found services, use them; otherwise use default services
      if (extractedServices.length > 0) {
        console.log("Extracted services:", extractedServices);
        setServices(extractedServices);
      } else {
        // Default services with updated text as requested
        setServices([{
          id: "estimation",
          title: "L'ESTIMATION",
          content: "Nous prenons un soin particulier à établir et déterminer la valeur précise du bien, grâce à notre forte connaissance du marché local et des méthodes d'évaluation différentes, afin d'obtenir le juste prix du bien."
        }, {
          id: "diffusion",
          title: "UNE DIFFUSION CIBLÉE",
          content: "Une diffusion sur le site et les réseaux sociaux pour une meilleure projection du bien. Validation de l'annonce avec les propriétaires. Diffusion de l'annonce sur les supports choisis."
        }, {
          id: "offre",
          title: "L'OFFRE D'ACHAT",
          content: "Transmission des offres d'achat avec les documents de solvabilité de l'acquéreur."
        }]);
      }
    }
  }, [pageData]);

  // Function to extract background image from the WordPress content
  function extractBackgroundImage(doc: Document) {
    // Look for elements with background image styles in the services section
    const servicesSectionElement = findServicesSectionByHeading(doc);
    if (servicesSectionElement) {
      // Try to find background image in style attributes
      const elementsWithBackground = Array.from(servicesSectionElement.querySelectorAll("*[style*='background']"));

      // Also look for container elements that might have background
      const potentialBgContainers = Array.from(servicesSectionElement.querySelectorAll(".elementor-background-overlay, .elementor-background-slideshow, .elementor-background, .section-bg")).concat(Array.from(servicesSectionElement.querySelectorAll("section, div")));

      // Combine and examine all potential elements
      const potentialElements = [...elementsWithBackground, ...potentialBgContainers];
      for (const element of potentialElements) {
        const style = element.getAttribute("style") || "";

        // Extract image URL from style
        const bgImageMatch = style.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/i);
        if (bgImageMatch && bgImageMatch[1]) {
          console.log("Found background image:", bgImageMatch[1]);
          setBackgroundImage(bgImageMatch[1]);
          return;
        }

        // Check if there is a dataset background
        const datasetBg = (element as HTMLElement).dataset?.background;
        if (datasetBg) {
          console.log("Found dataset background:", datasetBg);
          setBackgroundImage(datasetBg);
          return;
        }
      }

      // If we're here, try looking for images that might be backgrounds
      const backgroundImages = Array.from(servicesSectionElement.querySelectorAll("img"));
      if (backgroundImages.length > 0) {
        const src = backgroundImages[0].getAttribute("src");
        if (src) {
          console.log("Found background image from img:", src);
          setBackgroundImage(src);
          return;
        }
      }
    }

    // Also try to find the image by a key part of the filename used in the default image
    if (pageData?.content) {
      const matchLavender = pageData.content.match(/https:\/\/cote-sud\.immo\/[^"']*lavande[^"']*\.(jpg|jpeg|png|webp)/i);
      if (matchLavender && matchLavender[0]) {
        console.log("Found lavender image from content:", matchLavender[0]);
        setBackgroundImage(matchLavender[0]);
        return;
      }
    }

    // If pageData includes a featured image, use it as a fallback
    if (pageData?.featured_image) {
      console.log("Using featured image as fallback:", pageData.featured_image);
      setBackgroundImage(pageData.featured_image);
    }
  }

  // Helper function to find sections with headings containing "SERVICES"
  function findServicesSectionByHeading(doc: Document) {
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    for (const heading of headings) {
      if (heading.textContent?.includes("SERVICES")) {
        // Return the parent section or a parent element that might contain the services
        let parent = heading.parentElement;
        while (parent) {
          if (parent.tagName === "SECTION" || parent.classList.contains("section") || parent.classList.contains("elementor-section")) {
            return parent;
          }
          parent = parent.parentElement;
        }
        // If no suitable parent found, return the heading's parent as fallback
        return heading.parentElement;
      }
    }
    return null;
  }
  return <section className="relative mb-20">
      <div className="w-full h-[600px] bg-cover bg-center" style={{
      backgroundImage: `url('${backgroundImage}')`
    }}>
        <div className="absolute inset-0 bg-black/60">
          <div className="container mx-auto h-full flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 text-center md:text-left p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-normal text-[#CD9B59] mb-6">
                SERVICES DE L'AGENCE
              </h2>
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              {isLoading ? <div className="space-y-4">
                  <Skeleton className="h-10 w-full bg-white/10" />
                  <Skeleton className="h-10 w-full bg-white/10" />
                  <Skeleton className="h-10 w-full bg-white/10" />
                </div> : <Accordion type="single" collapsible className="bg-[#2A2B31]/90 rounded-md p-4">
                  {services.map(service => <AccordionItem key={service.id} value={service.id} className="border-b border-[#CD9B59]/30 last:border-0">
                      <AccordionTrigger className="text-[#CD9B59] hover:no-underline py-4 flex justify-between">
                        <span>{service.title}</span>
                        <div className="flex items-center">
                          
                          <Minus className="h-4 w-4 shrink-0 text-[#CD9B59] transition-all hidden group-data-[state=open]:block" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-white animate-accordion-down">
                        <div className="pt-2 pb-4">
                          {service.content}
                        </div>
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ServicesSection;