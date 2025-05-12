
import React, { useMemo, useState, useEffect } from "react";
import { useCustomPage } from "@/hooks/useCustomPage";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanElementorHtml, CleaningOptions } from "@/utils/elementorCleaner";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TeamMemberProps } from "@/components/team/TeamMember";
import { Phone, Mail, Linkedin } from "lucide-react";

interface CustomWordPressPageProps {
  slug: string;
  className?: string;
  showTitle?: boolean;
  cleaningOptions?: CleaningOptions;
  extractSection?: string;
  hideTeamSection?: boolean;
  styleTeamSection?: boolean;
  debugMode?: boolean;
  hideContent?: boolean;
  fallbackContent?: React.ReactNode;
  skipCustomApi?: boolean; // New option to skip custom API
}

const CustomWordPressPage: React.FC<CustomWordPressPageProps> = ({
  slug,
  className = "",
  showTitle = true,
  cleaningOptions,
  extractSection,
  hideTeamSection = false,
  styleTeamSection = false,
  debugMode = false,
  hideContent = false,
  fallbackContent = null,
  skipCustomApi // Pass this to useCustomPage
}) => {
  const {
    data: page,
    isLoading,
    isError,
    error
  } = useCustomPage(slug, { 
    showErrors: false,
    skipCustomApi: skipCustomApi 
  });
  
  const [showOriginalHtml, setShowOriginalHtml] = useState<boolean>(false);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [processedContent, setProcessedContent] = useState<string>("");

  // Use our custom hook to get team members if styling is enabled
  const {
    teamMembers,
    isFromWordPress
  } = styleTeamSection ? useTeamMembers() : {
    teamMembers: [],
    isFromWordPress: false
  };

  // Log errors for debugging purposes
  useEffect(() => {
    if (isError) {
      console.error(`Error loading page '${slug}':`, error);
    }
  }, [isError, error, slug]);

  // Process and clean the HTML content
  const processedHtmlContent = useMemo(() => {
    if (!page?.content) return "";
    
    let content = page.content;

    // Clean the Elementor HTML
    content = cleanElementorHtml(content, cleaningOptions);

    // Debug mode: store original content before team removal or styling
    const originalContentBeforeProcessing = content;

    // Make sure we don't try to style the team section if we're going to hide it
    const shouldStyleTeam = styleTeamSection && !hideTeamSection;

    // Style team section if requested (only if we're not hiding it)
    if (shouldStyleTeam) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        // Similar selectors as the team section remover, but now to style instead of remove
        const commonSelectors = ["[id*='equipe'], [id*='team'], [class*='equipe'], [class*='team']", "section:has(h1:contains('Notre Équipe')), section:has(h2:contains('Notre Équipe')), section:has(h3:contains('Notre Équipe'))", "section:has(h1:contains('Notre équipe')), section:has(h2:contains('Notre équipe')), section:has(h3:contains('Notre équipe'))", "section:has(h1:contains('NOTRE ÉQUIPE')), section:has(h2:contains('NOTRE ÉQUIPE')), section:has(h3:contains('NOTRE ÉQUIPE'))", "div:has(h1:contains('Notre Équipe')), div:has(h2:contains('Notre Équipe')), div:has(h3:contains('Notre Équipe'))", "div:has(h1:contains('Notre équipe')), div:has(h2:contains('Notre équipe')), div:has(h3:contains('Notre équipe'))", "div:has(h1:contains('NOTRE ÉQUIPE')), div:has(h2:contains('NOTRE ÉQUIPE')), div:has(h3:contains('NOTRE ÉQUIPE'))", "section:has(h1:contains('L'équipe')), section:has(h2:contains('L'équipe')), section:has(h3:contains('L'équipe'))", "div:has(h1:contains('L'équipe')), div:has(h2:contains('L'équipe')), div:has(h3:contains('L'équipe'))"];

        // Try all selectors
        let teamSectionFound = false;
        let styledTeamSection: Element | null = null;

        // Loop through all selectors to find the team section
        for (const selector of commonSelectors) {
          try {
            const elements = doc.querySelectorAll(selector);
            if (elements.length > 0) {
              elements.forEach(element => {
                console.log(`Found team section for styling with selector: ${selector}`);
                // Mark this section for styling
                styledTeamSection = element;
                teamSectionFound = true;
              });
              // Break once we've found a team section
              if (teamSectionFound) break;
            }
          } catch (e) {
            console.log(`Selector failed: ${selector}`, e);
          }
        }

        // If we didn't find using selectors, try by section ID
        if (!teamSectionFound) {
          const sectionIds = ["notre-equipe", "team", "equipe", "lequipe", "notre-team"];
          for (const id of sectionIds) {
            const element = doc.getElementById(id);
            if (element) {
              console.log(`Found team section with ID: ${id}`);
              styledTeamSection = element;
              teamSectionFound = true;
              break;
            }
          }
        }

        // If we found a team section, style it
        if (teamSectionFound && styledTeamSection) {
          // Create title section in our custom style
          const titleSection = document.createElement('div');
          titleSection.className = 'text-center mb-10';
          titleSection.innerHTML = `
            <h2 class="text-3xl font-playfair font-light text-gold mb-4">
              Notre Équipe
            </h2>
            <p class="max-w-2xl mx-auto text-gray-600">
              Une équipe de professionnels <span class="font-medium">spécialisés dans l'immobilier</span> de luxe sur la Côte d'Azur, à votre service pour tous vos projets.
            </p>
            ${isFromWordPress ? '<p class="text-xs text-gray-400 mt-2">Informations synchronisées avec le site WordPress</p>' : ''}
            <div class="w-24 h-0.5 bg-gold/30 mx-auto mt-6"></div>
          `;

          // Create grid container for team members
          const teamGrid = document.createElement('div');
          teamGrid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8';

          // Generate team member cards if we have data
          if (teamMembers.length > 0) {
            teamMembers.forEach((member: TeamMemberProps) => {
              const initials = member.name.split(" ").map(n => n[0]).join("");
              const memberCard = document.createElement('div');
              memberCard.className = 'bg-cream border border-gold/20 hover:shadow-md transition-shadow duration-300 rounded-lg p-6';
              memberCard.innerHTML = `
                <div class="flex flex-col items-center text-center">
                  <div class="h-24 w-24 border-2 border-gold mb-4 rounded-full overflow-hidden flex items-center justify-center bg-gold/10">
                    ${member.imageUrl ? `<img src="${member.imageUrl}" alt="${member.name}" class="w-full h-full object-cover" />` : `<div class="text-gold text-lg">${initials}</div>`}
                  </div>
                  <h3 class="font-playfair text-xl text-gold mb-1">${member.name}</h3>
                  ${member.role ? `<p class="text-sm text-gray-600 mb-3">${member.role}</p>` : ''}
                  <div class="flex items-center justify-center gap-3 mt-3">
                    <a href="tel:${member.phone.replace(/\s/g, '')}" 
                       class="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
                       title="${member.phone}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CD9B59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </a>
                    ${member.email ? `
                      <a href="mailto:${member.email}" 
                         class="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
                         title="${member.email}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CD9B59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </a>
                    ` : ''}
                    ${member.linkedin ? `
                      <a href="${member.linkedin}" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         class="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
                         title="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CD9B59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                    ` : ''}
                  </div>
                  <p class="mt-2 text-sm font-medium">${member.phone}</p>
                </div>
              `;
              teamGrid.appendChild(memberCard);
            });
          } else {
            // If no team members data, display a message
            const noDataMessage = document.createElement('div');
            noDataMessage.className = 'col-span-full text-center text-gray-500';
            noDataMessage.textContent = 'Aucune information sur l\'équipe n\'est disponible pour le moment.';
            teamGrid.appendChild(noDataMessage);
          }

          // Replace the original team section content with our styled version
          styledTeamSection.innerHTML = '';
          styledTeamSection.className = 'py-12';
          styledTeamSection.id = 'notre-equipe';
          styledTeamSection.appendChild(titleSection);
          styledTeamSection.appendChild(teamGrid);
          console.log("Successfully styled team section");
        } else {
          console.log("No team section found to style");
        }

        // Update content with the styled version
        content = doc.body.innerHTML;
      } catch (error) {
        console.error("Error styling team section:", error);
      }
    }

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
        "section:has(h1:contains('Notre Équipe')), section:has(h2:contains('Notre Équipe')), section:has(h3:contains('Notre Équipe'))", "section:has(h1:contains('Notre équipe')), section:has(h2:contains('Notre équipe')), section:has(h3:contains('Notre équipe'))", "section:has(h1:contains('NOTRE ÉQUIPE')), section:has(h2:contains('NOTRE ÉQUIPE')), section:has(h3:contains('NOTRE ÉQUIPE'))",
        // Same for div containers
        "div:has(h1:contains('Notre Équipe')), div:has(h2:contains('Notre Équipe')), div:has(h3:contains('Notre Équipe'))", "div:has(h1:contains('Notre équipe')), div:has(h2:contains('Notre équipe')), div:has(h3:contains('Notre équipe'))", "div:has(h1:contains('NOTRE ÉQUIPE')), div:has(h2:contains('NOTRE ÉQUIPE')), div:has(h3:contains('NOTRE ÉQUIPE'))",
        // "L'équipe" variations
        "section:has(h1:contains('L'équipe')), section:has(h2:contains('L'équipe')), section:has(h3:contains('L'équipe'))", "div:has(h1:contains('L'équipe')), div:has(h2:contains('L'équipe')), div:has(h3:contains('L'équipe'))"];

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
            if (headingText.includes('notre équipe') || headingText.includes('notre equipe') || headingText.includes('l\'équipe') || headingText.includes('l\'equipe') || headingText.includes('team') || headingText.includes('équipe') || headingText.includes('equipe')) {
              // Walk up the DOM to find a parent section/div that represents the whole team section
              let parent = heading.parentElement;
              let sectionFound = false;
              const MAX_DEPTH = 5; // Don't go too far up the tree
              let depth = 0;

              // Find the appropriate container to remove (section, div with multiple children, etc.)
              while (parent && depth < MAX_DEPTH && !sectionFound) {
                // If we found a section element or a substantial div, remove it
                if (parent.tagName === 'SECTION' || parent.tagName === 'DIV' && (parent.children.length > 2 || parent.classList.length > 0 || parent.id)) {
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
        const elementorDoc = page.elementor_data ? parser.parseFromString(`<div>${page.elementor_data}</div>`, "text/html") : null;
        const elementorSection = elementorDoc?.querySelector(extractSection);
        return elementorSection ? elementorSection.innerHTML : content;
      }
    }

    // In debug mode, store the content for comparison
    if (debugMode) {
      setOriginalContent(originalContentBeforeProcessing);
      setProcessedContent(content);
    }
    return content;
  }, [page, cleaningOptions, extractSection, hideTeamSection, styleTeamSection, teamMembers, isFromWordPress, debugMode]);

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

  if (isError || !page) {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }
    
    return (
      <div className="text-center py-12 px-4">
        <h3 className="font-playfair text-2xl text-sable mb-4">
          Contenu non disponible
        </h3>
        <p className="text-anthracite mb-6">
          Nous ne pouvons pas afficher ce contenu pour le moment. Veuillez réessayer ultérieurement.
        </p>
        <div className="w-24 h-0.5 bg-sable/30 mx-auto"></div>
      </div>
    );
  }

  if (hideContent) {
    return null;
  }

  return (
    <div className={`wordpress-page ${className}`}>
      {showTitle && page && (
        <>
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-sable text-center mb-6"
            dangerouslySetInnerHTML={{ __html: page.title }}
          />
          <div className="w-24 h-0.5 bg-sable/30 mx-auto mb-12"></div>
        </>
      )}
      
      {page?.featured_image && (
        <div className="featured-image mb-8">
          <img 
            src={page.featured_image} 
            alt={page.title || "Featured image"} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      {page && (
        <div 
          className="page-content prose max-w-none prose-headings:text-sable prose-headings:font-light elementor-content"
          dangerouslySetInnerHTML={{ __html: processedHtmlContent }}
        />
      )}

      {debugMode && (
        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Debug Mode</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOriginalHtml(!showOriginalHtml)}
            >
              {showOriginalHtml ? "Show Processed HTML" : "Show Original HTML"}
            </Button>
          </div>
          
          <div className="bg-white p-2 rounded border overflow-auto max-h-64">
            <pre className="text-xs">
              {showOriginalHtml ? originalContent : processedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomWordPressPage;
