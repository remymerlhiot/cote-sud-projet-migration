
import React, { useMemo, useState, useEffect } from "react";
import { useCustomPage } from "@/hooks/useCustomPage";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanElementorHtml, CleaningOptions } from "@/utils/elementorCleaner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface CustomWordPressPageProps {
  slug: string;
  className?: string;
  showTitle?: boolean;
  cleaningOptions?: CleaningOptions;
  extractSection?: string;
  hideTeamSection?: boolean;
  debugMode?: boolean;
}

const CustomWordPressPage: React.FC<CustomWordPressPageProps> = ({ 
  slug, 
  className = "",
  showTitle = true,
  cleaningOptions,
  extractSection,
  hideTeamSection = false,
  debugMode = false
}) => {
  const { data: page, isLoading, isError } = useCustomPage(slug);
  const [showOriginalHtml, setShowOriginalHtml] = useState(false);

  // Process and clean the HTML content
  const processedContent = useMemo(() => {
    if (!page?.content) return "";
    
    let content = page.content;
    
    // Clean the Elementor HTML
    content = cleanElementorHtml(content, cleaningOptions);
    
    // Debug mode: capture original content before team removal
    const originalContent = content;
    
    // Remove team section if requested
    if (hideTeamSection) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        
        // Aggressive approach to find and remove team sections
        let teamSectionRemoved = false;
        
        // 1. More precise selectors based on common WordPress/Elementor patterns
        const commonSelectors = [
          // Using attribute contains to match id or class containing team-related terms
          "[id*='equipe'], [id*='team'], [class*='equipe'], [class*='team']",
          // Heading-based selectors (more specific)
          "section:has(h1:contains('Notre Équipe')), section:has(h2:contains('Notre Équipe')), section:has(h3:contains('Notre Équipe'))",
          "section:has(h1:contains('Notre équipe')), section:has(h2:contains('Notre équipe')), section:has(h3:contains('Notre équipe'))",
          "section:has(h1:contains('NOTRE ÉQUIPE')), section:has(h2:contains('NOTRE ÉQUIPE')), section:has(h3:contains('NOTRE ÉQUIPE'))",
          // Same for div containers
          "div:has(h1:contains('Notre Équipe')), div:has(h2:contains('Notre Équipe')), div:has(h3:contains('Notre Équipe'))",
          "div:has(h1:contains('Notre équipe')), div:has(h2:contains('Notre équipe')), div:has(h3:contains('Notre équipe'))",
          "div:has(h1:contains('NOTRE ÉQUIPE')), div:has(h2:contains('NOTRE ÉQUIPE')), div:has(h3:contains('NOTRE ÉQUIPE'))",
          // "L'équipe" variations
          "section:has(h1:contains('L'équipe')), section:has(h2:contains('L'équipe')), section:has(h3:contains('L'équipe'))",
          "div:has(h1:contains('L'équipe')), div:has(h2:contains('L'équipe')), div:has(h3:contains('L'équipe'))"
        ];
        
        // Try all selectors
        for (const selector of commonSelectors) {
          try {
            const elements = doc.querySelectorAll(selector);
            if (elements.length > 0) {
              elements.forEach(element => {
                console.log(`Found team section with selector: ${selector}`);
                element.parentNode?.removeChild(element);
                teamSectionRemoved = true;
              });
            }
          } catch (e) {
            console.log(`Selector failed: ${selector}`, e);
          }
        }
        
        // 2. Find by section ID directly (common in Elementor)
        const sectionIds = ["notre-equipe", "team", "equipe", "lequipe", "notre-team"];
        sectionIds.forEach(id => {
          const element = doc.getElementById(id);
          if (element) {
            console.log(`Found team section with ID: ${id}`);
            element.parentNode?.removeChild(element);
            teamSectionRemoved = true;
          }
        });
        
        // 3. Broader text-based search - look for sections that might contain team headings
        if (!teamSectionRemoved) {
          // Find all headings that could indicate a team section
          const allHeadings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
          
          allHeadings.forEach(heading => {
            const headingText = heading.textContent?.toLowerCase() || '';
            
            // Check for team-related keywords in headings
            if (
              headingText.includes('notre équipe') || 
              headingText.includes('notre equipe') ||
              headingText.includes('l\'équipe') || 
              headingText.includes('l\'equipe') ||
              headingText.includes('team') ||
              headingText.includes('équipe') ||
              headingText.includes('equipe')
            ) {
              // Walk up the DOM to find a parent section/div that represents the whole team section
              let parent = heading.parentElement;
              let sectionFound = false;
              const MAX_DEPTH = 5; // Don't go too far up the tree
              let depth = 0;
              
              // Find the appropriate container to remove (section, div with multiple children, etc.)
              while (parent && depth < MAX_DEPTH && !sectionFound) {
                // If we found a section element or a substantial div, remove it
                if (
                  parent.tagName === 'SECTION' || 
                  (parent.tagName === 'DIV' && 
                   (parent.children.length > 2 || 
                    parent.classList.length > 0 || 
                    parent.id))
                ) {
                  console.log(`Found team section via heading text: "${headingText}"`);
                  parent.parentNode?.removeChild(parent);
                  teamSectionRemoved = true;
                  sectionFound = true;
                  break;
                }
                parent = parent.parentElement;
                depth++;
              }
              
              // If we couldn't find a proper parent container, remove at least the heading's parent
              if (!sectionFound && heading.parentElement) {
                console.log(`Removing heading parent for: "${headingText}"`);
                heading.parentElement.parentNode?.removeChild(heading.parentElement);
                teamSectionRemoved = true;
              }
            }
          });
        }
        
        // 4. Most aggressive approach - look for any element containing team-related text
        if (!teamSectionRemoved) {
          // Get all larger container elements that could be team sections
          const containers = doc.querySelectorAll('section, div.elementor-section, div.elementor-container, div[class*="section"], div[class*="container"]');
          
          containers.forEach(container => {
            const containerText = container.textContent?.toLowerCase() || '';
            
            // If container contains multiple team-related keywords, likely a team section
            const keywords = ['équipe', 'equipe', 'team', 'membre'];
            let keywordCount = 0;
            
            keywords.forEach(keyword => {
              if (containerText.includes(keyword)) {
                keywordCount++;
              }
            });
            
            // If multiple keywords found and container is substantial, remove it
            if (keywordCount >= 2 && container.children.length > 2) {
              console.log(`Found team section by keyword density: ${keywordCount} keywords`);
              container.parentNode?.removeChild(container);
              teamSectionRemoved = true;
            }
          });
        }
        
        // Set the cleaned content back
        content = doc.body.innerHTML;
        
        // Debug: report if we successfully removed a team section
        if (teamSectionRemoved) {
          console.log("Successfully removed one or more team sections");
        } else {
          console.log("No team sections found to remove");
        }
      } catch (error) {
        console.error("Error removing team section:", error);
      }
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
    
    // In debug mode, store the original content for comparison
    if (debugMode) {
      window.originalWordPressContent = originalContent;
      window.processedWordPressContent = content;
    }
    
    return content;
  }, [page, cleaningOptions, extractSection, hideTeamSection, debugMode]);

  // Debug feature: toggle between original and processed content
  useEffect(() => {
    if (debugMode) {
      console.log("WordPress page debug mode enabled");
    }
  }, [debugMode]);

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
      
      {debugMode && (
        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded">
          <p className="text-sm text-amber-800 mb-2">Mode debug activé</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowOriginalHtml(!showOriginalHtml);
              toast.info(showOriginalHtml ? "Affichage du contenu traité" : "Affichage du contenu original");
            }}
            className="text-xs"
          >
            {showOriginalHtml ? "Voir contenu traité" : "Voir contenu original"}
          </Button>
        </div>
      )}
      
      <div 
        className="page-content prose max-w-none prose-headings:text-gold prose-headings:font-playfair prose-headings:font-light font-raleway elementor-content"
        dangerouslySetInnerHTML={{ 
          __html: debugMode && showOriginalHtml 
            ? (window as any).originalWordPressContent || "Contenu original non disponible" 
            : processedContent 
        }}
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
