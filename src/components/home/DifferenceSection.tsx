
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useCustomPage } from "@/hooks/useCustomPage";
import { cleanElementorHtml } from "@/utils/elementorCleaner";
import { Skeleton } from "@/components/ui/skeleton";

type DifferenceContent = {
  title: string;
  image: string;
  mainText: string[];
  accompagnementTitle: string;
  accompagnementText: string[];
};

const DifferenceSection = () => {
  // Fetch homepage content
  const {
    data: homePage,
    isLoading
  } = useCustomPage("new-home");
  
  const [content, setContent] = useState<DifferenceContent>({
    title: "LA DIFFÉRENCE",
    image: "https://cote-sud.immo/wp-content/uploads/2025/01/kahn-louis.png",
    mainText: ["Aujourd'hui, notre priorité est d'offrir un accompagnement sur-mesure et une expertise complète, tant sur le plan immobilier que sur le plan patrimonial, fiscal ou juridique.", "Nous nous engageons à fournir un service personnalisé, en collaboration avec des partenaires de confiance, pour chaque étape de votre projet immobilier, qu'il s'agisse d'achat ou de vente."],
    accompagnementTitle: "L'ACCOMPAGNEMENT",
    accompagnementText: ["Notaires, courtiers, architectes, maîtres d'œuvre, entreprises générales et spécialisées, décorateurs d'intérieur, home-stagers, concierges, paysagistes… Nos experts sont sélectionnés pour leur savoir-faire et leur engagement à valoriser chaque détail de votre bien."]
  });

  useEffect(() => {
    if (homePage?.content) {
      extractDifferenceContent(homePage.content);
    }
  }, [homePage]);

  const extractDifferenceContent = (htmlContent: string) => {
    // Parse the content
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanElementorHtml(htmlContent), "text/html");

    // Try to find the difference section
    const differenceSection = findDifferenceSectionByHeading(doc);
    if (differenceSection) {
      const newContent: DifferenceContent = {
        ...content
      };

      // Extract title
      const titleElement = differenceSection.querySelector("h1, h2, h3, h4, h5, h6");
      if (titleElement && titleElement.textContent) {
        newContent.title = titleElement.textContent.trim();
      }

      // Extract image
      const imageElement = differenceSection.querySelector("img");
      if (imageElement && imageElement.getAttribute("src")) {
        newContent.image = imageElement.getAttribute("src") || content.image;
      }

      // Extract main text paragraphs
      const mainTextElements = Array.from(differenceSection.querySelectorAll("p"));
      const mainTexts: string[] = [];
      const accompagnementTexts: string[] = [];
      let foundAccompagnement = false;
      let accompagnementTitle = "";

      // Process paragraphs
      for (const paragraph of mainTextElements) {
        const text = paragraph.textContent?.trim();
        if (!text) continue;

        // Check if this is the accompagnement section
        const prevElement = paragraph.previousElementSibling;
        if (prevElement && prevElement.tagName.match(/^H[1-6]$/)) {
          const headingText = prevElement.textContent?.trim();
          if (headingText && headingText.includes("ACCOMPAGNEMENT")) {
            foundAccompagnement = true;
            accompagnementTitle = headingText;
            accompagnementTexts.push(text);
            continue;
          }
        }

        // If we've found accompagnement section, add to that array
        if (foundAccompagnement) {
          accompagnementTexts.push(text);
        } else {
          mainTexts.push(text);
        }
      }

      // If we found content, update the state
      if (mainTexts.length > 0) {
        newContent.mainText = mainTexts;
      }
      if (accompagnementTexts.length > 0) {
        newContent.accompagnementText = accompagnementTexts;
      }
      if (accompagnementTitle) {
        newContent.accompagnementTitle = accompagnementTitle;
      }
      setContent(newContent);
    }
  };

  // Helper function to find the difference section by heading
  function findDifferenceSectionByHeading(doc: Document) {
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    for (const heading of headings) {
      if (heading.textContent?.includes("DIFFÉRENCE")) {
        // Find the parent section that contains this heading
        let parent = heading.parentElement;
        while (parent) {
          if (parent.tagName === "SECTION" || parent.classList.contains("section") || parent.classList.contains("elementor-section")) {
            return parent;
          }
          parent = parent.parentElement;
        }
        // If no suitable parent found, return the parent of the heading
        return heading.parentElement;
      }
    }
    return null;
  }

  return (
    <section className="container mx-auto mb-20 px-4">
      {isLoading ? (
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="md:w-1/3">
            <Skeleton className="w-full h-[300px] rounded-full" />
          </div>
          <div className="md:w-2/3">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-12 w-48 mt-4" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="md:w-1/3">
            <div className="overflow-hidden rounded-full aspect-square border-4 border-sable shadow-lg">
              <img src={content.image} alt="AXO Côté Sud - La différence" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-playfair font-normal text-sable mb-4 lg:text-4xl">
                {content.title}
              </h2>
              
              {content.mainText.map((paragraph, index) => (
                <p key={`main-${index}`} className="text-anthracite mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-normal text-sable mb-4 lg:text-4xl">
                {content.accompagnementTitle}
              </h2>
              
              {content.accompagnementText.map((paragraph, index) => (
                <p key={`accomp-${index}`} className="text-anthracite mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DifferenceSection;
