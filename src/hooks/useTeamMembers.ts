
import { useNotreHistoire } from "@/hooks/useNotreHistoire";
import { TeamMemberProps } from "@/components/team/TeamMember";

/**
 * Custom hook to extract team members from WordPress content
 * Falls back to static data if WordPress content can't be parsed
 */
export const useTeamMembers = () => {
  // Fetch the WordPress page content
  const { data: page, isLoading, isError } = useNotreHistoire();
  
  // Process the page content to extract team members
  const extractTeamMembers = (): { 
    teamMembers: TeamMemberProps[];
    isFromWordPress: boolean;
  } => {
    // Default/fallback team members (currently in the codebase)
    const fallbackMembers: TeamMemberProps[] = [
      {
        name: "Marie Dupont",
        phone: "06 12 34 56 78",
        email: "marie@cotesud.fr",
        role: "Directrice",
        imageUrl: "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png",
      },
      {
        name: "Pierre Martin",
        phone: "06 23 45 67 89",
        email: "pierre@cotesud.fr",
        linkedin: "https://linkedin.com/in/example",
        role: "Agent immobilier",
        imageUrl: "/lovable-uploads/97689347-4c31-4d84-bcba-5f3e6f50b63e.png",
      },
      {
        name: "Sophie Leclerc",
        phone: "06 34 56 78 90",
        email: "sophie@cotesud.fr",
        role: "Conseillère",
        imageUrl: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
      },
      {
        name: "Jean Moreau",
        phone: "06 45 67 89 01",
        email: "jean@cotesud.fr",
        role: "Expert immobilier",
        imageUrl: "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png",
      },
    ];
    
    // If no page content, return fallback data
    if (!page?.content) {
      return { teamMembers: fallbackMembers, isFromWordPress: false };
    }
    
    try {
      // Create a parser to work with the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(page.content, "text/html");
      
      // Try to find the team section in the WordPress content
      // We're looking for sections or divs with text containing "équipe" or specific class names
      const teamSectionSelectors = [
        // Common selectors that might contain team info
        ".team-section", 
        ".notre-equipe",
        ".elementor-section:has(h2:contains('Notre Équipe'))",
        ".elementor-section:has(h3:contains('équipe'))",
        // Look for divs with team-related content
        "div:has(img):has(.team-member-name)",
        // Find any section with team members
        "section:has(h2:contains('quipe'))",
        ".elementor-widget-container:has(h2:contains('quipe'))",
      ];
      
      // Try each selector
      let teamSection = null;
      for (const selector of teamSectionSelectors) {
        try {
          const section = doc.querySelector(selector);
          if (section) {
            teamSection = section;
            break;
          }
        } catch (e) {
          // Invalid selector, continue to next
          console.log("Selector failed:", selector);
        }
      }
      
      // If we still don't have a team section, look for it by content
      if (!teamSection) {
        // Find headings that might indicate a team section
        const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
        for (const heading of headings) {
          if (heading.textContent?.toLowerCase().includes("équipe") || 
              heading.textContent?.toLowerCase().includes("equipe") || 
              heading.textContent?.toLowerCase().includes("team")) {
            // Found a potential team section heading, get its parent section
            let parent = heading.parentElement;
            while (parent && parent.tagName !== "SECTION" && parent.tagName !== "DIV") {
              parent = parent.parentElement;
            }
            if (parent) {
              teamSection = parent;
              break;
            }
          }
        }
      }
      
      // If we found a team section, try to extract member info
      if (teamSection) {
        // Look for team member cards/elements within the section
        const memberElements = teamSection.querySelectorAll(".team-member, .elementor-widget-image-box, .elementor-widget-person");
        
        // If we found specific member elements
        if (memberElements && memberElements.length > 0) {
          const extractedMembers: TeamMemberProps[] = [];
          
          memberElements.forEach((memberElement) => {
            // Extract name
            const nameElement = memberElement.querySelector("h3, h4, .elementor-image-box-title, .elementor-person-name");
            const name = nameElement?.textContent?.trim() || "";
            
            // Extract role
            const roleElement = memberElement.querySelector(".elementor-image-box-description, .elementor-person-title, .role, p");
            const role = roleElement?.textContent?.trim() || "";
            
            // Extract phone
            const phoneElement = memberElement.querySelector("a[href^='tel:'], .phone, .elementor-icon-list-text:contains('06')");
            let phone = phoneElement?.textContent?.trim() || "";
            // If no direct phone element found, look for it in text content
            if (!phone) {
              const text = memberElement.textContent || "";
              const phoneMatch = text.match(/(?:0|\+33|0033)[1-9](?:[\s.-]?[0-9]{2}){4}/);
              if (phoneMatch) {
                phone = phoneMatch[0];
              }
            }
            
            // Extract email
            let email = "";
            const emailElement = memberElement.querySelector("a[href^='mailto:'], .email");
            if (emailElement) {
              email = emailElement.textContent?.trim() || "";
              if (email.startsWith("mailto:")) {
                email = email.substring(7);
              }
            } else {
              // Try to find email in href
              const emailLink = memberElement.querySelector("a[href*='@']");
              if (emailLink) {
                const href = emailLink.getAttribute("href") || "";
                if (href.startsWith("mailto:")) {
                  email = href.substring(7);
                }
              }
            }
            
            // Extract LinkedIn
            let linkedin = "";
            const linkedinElement = memberElement.querySelector("a[href*='linkedin.com'], .linkedin");
            if (linkedinElement) {
              linkedin = linkedinElement.getAttribute("href") || "";
            }
            
            // Extract image URL
            let imageUrl = "";
            const imgElement = memberElement.querySelector("img");
            if (imgElement) {
              imageUrl = imgElement.getAttribute("src") || "";
            }
            
            // Only add member if at least name and phone are available
            if (name && (phone || email)) {
              extractedMembers.push({
                name,
                phone: phone || "Numéro non disponible",
                role,
                email,
                linkedin,
                imageUrl
              });
            }
          });
          
          // If we successfully extracted members, return them
          if (extractedMembers.length > 0) {
            return { teamMembers: extractedMembers, isFromWordPress: true };
          }
        }
      }
      
      // If we couldn't extract members with the above methods, return fallback data
      console.log("Could not extract team members from WordPress content");
      return { teamMembers: fallbackMembers, isFromWordPress: false };
      
    } catch (error) {
      console.error("Error parsing WordPress content for team members:", error);
      return { teamMembers: fallbackMembers, isFromWordPress: false };
    }
  };
  
  // Return loading state, error state, and extracted team members
  return {
    teamMembers: extractTeamMembers().teamMembers,
    isFromWordPress: extractTeamMembers().isFromWordPress,
    isLoading,
    isError
  };
};
