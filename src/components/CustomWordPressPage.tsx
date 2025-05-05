
import React, { useMemo } from "react";
import { useCustomPage } from "@/hooks/useCustomPage";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanElementorHtml, CleaningOptions } from "@/utils/elementorCleaner";

interface CustomWordPressPageProps {
  slug: string;
  className?: string;
  showTitle?: boolean;
  cleaningOptions?: CleaningOptions;
  extractSection?: string;
  hideTeamSection?: boolean;
}

const CustomWordPressPage: React.FC<CustomWordPressPageProps> = ({ 
  slug, 
  className = "",
  showTitle = true,
  cleaningOptions,
  extractSection,
  hideTeamSection = false
}) => {
  const { data: page, isLoading, isError } = useCustomPage(slug);

  // Process and clean the HTML content
  const processedContent = useMemo(() => {
    if (!page?.content) return "";
    
    let content = page.content;
    
    // Clean the Elementor HTML
    content = cleanElementorHtml(content, cleaningOptions);
    
    // Remove team section if requested
    if (hideTeamSection) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      
      // More robust approach to identify and remove team section(s)
      const teamSectionSelectors = [
        // Common team section identifiers
        "#notre-equipe", 
        "#team",
        ".notre-equipe",
        ".team-section",
        "section:has(h2:contains('Notre Équipe'))",
        "section:has(h2:contains('Notre équipe'))",
        "section:has(h2:contains('NOTRE ÉQUIPE'))",
        "div:has(h2:contains('Notre Équipe'))",
        "div:has(h2:contains('Notre équipe'))",
        "div:has(h2:contains('NOTRE ÉQUIPE'))",
        "section:has(h3:contains('équipe'))",
        "div:has(h3:contains('équipe'))"
      ];
      
      // First attempt with CSS selectors
      for (const selector of teamSectionSelectors) {
        try {
          const elements = doc.querySelectorAll(selector);
          elements.forEach(element => {
            if (element) {
              console.log("Found and removing team section with selector:", selector);
              element.parentNode?.removeChild(element);
            }
          });
        } catch (e) {
          console.log("Selector failed:", selector);
        }
      }
      
      // Fallback: Text-based approach
      const allSections = doc.querySelectorAll('section, div');
      allSections.forEach(section => {
        const sectionText = section.textContent?.toLowerCase() || '';
        const sectionHTML = section.innerHTML?.toLowerCase() || '';
        
        // If section contains team-related text, consider removing it
        if (
          (sectionText.includes('notre équipe') || 
           sectionText.includes('notre equipe') || 
           sectionText.includes('team') ||
           sectionHTML.includes('notre équipe') || 
           sectionHTML.includes('notre equipe')) &&
          // Ensure it's a substantial section, not just a small reference
          section.children.length > 1
        ) {
          console.log("Found team section via text content, removing");
          section.parentNode?.removeChild(section);
        }
        
        // Look for headings that might indicate team sections
        const teamHeadings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
        teamHeadings.forEach(heading => {
          const headingText = heading.textContent?.toLowerCase() || '';
          if (
            headingText.includes('notre équipe') || 
            headingText.includes('notre equipe') ||
            headingText.includes('team')
          ) {
            // Find the parent container of this heading
            let parentSection = heading.parentElement;
            let depth = 0;
            
            // Try to find the actual section container (up to 3 levels up)
            while (parentSection && depth < 3) {
              if (
                parentSection.tagName === 'SECTION' || 
                (parentSection.tagName === 'DIV' && parentSection.children.length > 2)
              ) {
                console.log("Found team section via heading, removing parent element");
                parentSection.parentNode?.removeChild(parentSection);
                break;
              }
              parentSection = parentSection.parentElement;
              depth++;
            }
            
            // If we couldn't find a suitable parent section, remove this specific heading's container
            if (depth >= 3 && heading.parentElement) {
              console.log("Found team heading, removing its container");
              heading.parentElement.parentNode?.removeChild(heading.parentElement);
            }
          }
        });
      });
      
      content = doc.body.innerHTML;
    }
    
    // Extract specific section if requested
    if (extractSection) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const section = doc.querySelector(extractSection);
      
      if (section) {
        return section.innerHTML;
      } else {
        // If specific section not found, try to find it in the elementor_data
        const elementorDoc = page.elementor_data ? 
          parser.parseFromString(`<div>${page.elementor_data}</div>`, "text/html") : null;
        
        const elementorSection = elementorDoc?.querySelector(extractSection);
        return elementorSection ? elementorSection.innerHTML : content;
      }
    }
    
    return content;
  }, [page, cleaningOptions, extractSection, hideTeamSection]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showTitle && <Skeleton className="h-12 w-3/4" />}
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">Erreur lors du chargement de la page</div>;
  }

  if (!page) {
    return <div className="text-center p-8 text-[#CD9B59]">Page introuvable</div>;
  }

  return (
    <div className={`wordpress-page ${className}`}>
      {showTitle && (
        <h1 className="text-3xl font-playfair font-light text-[#CD9B59] mb-6">
          {page.title}
        </h1>
      )}
      
      {page.featured_image && (
        <div className="featured-image mb-8">
          <img 
            src={page.featured_image} 
            alt={page.title} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div 
        className="page-content prose max-w-none prose-headings:text-gold prose-headings:font-playfair prose-headings:font-light font-raleway elementor-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      
      {!hideTeamSection && page.media_list && page.media_list.length > 0 && (
        <div className="media-gallery mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {page.media_list.map((imageUrl, index) => (
            <div key={index} className="media-item">
              <img 
                src={imageUrl} 
                alt={`Media ${index + 1} - ${page.title}`} 
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomWordPressPage;
