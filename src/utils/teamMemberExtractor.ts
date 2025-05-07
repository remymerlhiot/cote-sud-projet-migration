
/**
 * Utility functions to extract team member information from WordPress content
 */

import { TeamMemberProps } from "@/components/team/TeamMember";

/**
 * Extract team members from WordPress HTML content
 */
export const extractTeamMembersFromHTML = (htmlContent: string): TeamMemberProps[] => {
  if (!htmlContent) {
    return [];
  }
  
  try {
    // Create a parser to work with the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    return extractMembersFromEntirePage(doc);
  } catch (error) {
    console.error("Error parsing WordPress content for team members:", error);
    return [];
  }
};

/**
 * Look for any team member-like structures throughout the page
 */
const extractMembersFromEntirePage = (doc: Document): TeamMemberProps[] => {
  const extractedMembers: TeamMemberProps[] = [];
  
  // Look for images that might be team members
  const images = doc.querySelectorAll("img");
  
  for (const img of images) {
    // Find potential team member containers (parent elements up to 3 levels)
    let container = img.parentElement;
    let depth = 0;
    
    while (container && depth < 3) {
      const containerText = container.textContent || '';
      
      // Check if this container has phone number or email-like content
      const hasPhonePattern = /(?:0|\+33|0033)[1-9](?:[\s.-]?[0-9]{2}){4}/.test(containerText);
      const hasEmailPattern = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(containerText);
      
      if (hasPhonePattern || hasEmailPattern) {
        // This might be a team member
        const name = findNameInContainer(container);
        
        if (name) {
          // Extract member information
          const phone = extractPhone(container);
          const email = extractEmail(container);
          const role = extractRole(container, name);
          const linkedin = extractLinkedIn(container);
          const imageUrl = img.getAttribute("src") || "";
          
          // Add to extracted members if basic info is available
          if (name && (phone || email)) {
            extractedMembers.push({
              name,
              phone: phone || "Numéro non disponible",
              email,
              linkedin,
              role,
              imageUrl
            });
            
            // Break the loop as we've found what we need
            break;
          }
        }
      }
      
      // Move up the DOM tree
      container = container.parentElement;
      depth++;
    }
  }
  
  return extractedMembers;
};

/**
 * Find name in a container element
 */
const findNameInContainer = (container: Element): string => {
  // First look for headings
  const heading = container.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading && heading.textContent && heading.textContent.trim().length > 0) {
    return heading.textContent.trim();
  }
  
  // Then look for elements with potential name classes
  const nameEl = container.querySelector(".name, .title, .agent-name, strong, b");
  if (nameEl && nameEl.textContent && nameEl.textContent.trim().length > 0) {
    return nameEl.textContent.trim();
  }
  
  // Then look for the first paragraph or div if it's short (likely a name)
  const firstP = container.querySelector("p, div");
  if (firstP && firstP.textContent) {
    const text = firstP.textContent.trim();
    // If text is short and not phone/email, it might be a name
    if (text.length > 0 && text.length < 40 && 
        !text.includes('@') && !/\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/.test(text)) {
      return text;
    }
  }
  
  return "";
};

/**
 * Extract phone number from container
 */
const extractPhone = (container: Element): string => {
  // Look for phone in href
  const phoneLink = container.querySelector("a[href^='tel:']");
  if (phoneLink && phoneLink.getAttribute("href")) {
    const href = phoneLink.getAttribute("href") || "";
    return href.replace('tel:', '');
  }
  
  // Look for phone in text
  const text = container.textContent || "";
  const phoneMatch = text.match(/(?:0|\+33|0033)[1-9](?:[\s.-]?[0-9]{2}){4}/);
  if (phoneMatch) {
    return phoneMatch[0];
  }
  
  return "";
};

/**
 * Extract email from container
 */
const extractEmail = (container: Element): string => {
  // Look for email in href
  const emailLink = container.querySelector("a[href^='mailto:']");
  if (emailLink && emailLink.getAttribute("href")) {
    const href = emailLink.getAttribute("href") || "";
    return href.replace('mailto:', '');
  }
  
  // Look for email in text
  const text = container.textContent || "";
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    return emailMatch[0];
  }
  
  return "";
};

/**
 * Extract role/position from container
 */
const extractRole = (container: Element, name: string): string => {
  // First try to find "role" by class
  const roleEl = container.querySelector(".role, .position, .job-title");
  if (roleEl && roleEl.textContent) {
    return roleEl.textContent.trim();
  }
  
  // Try to find paragraphs after the name
  const paragraphs = container.querySelectorAll("p");
  for (const p of paragraphs) {
    if (p.textContent && 
        !p.textContent.includes(name) && 
        !p.textContent.includes('@') && 
        !/\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/.test(p.textContent)) {
      const text = p.textContent.trim();
      // If it's short, it could be a role
      if (text.length > 0 && text.length < 40) {
        return text;
      }
    }
  }
  
  return "";
};

/**
 * Extract LinkedIn URL from container
 */
const extractLinkedIn = (container: Element): string => {
  const linkedinLink = container.querySelector("a[href*='linkedin.com']");
  if (linkedinLink && linkedinLink.getAttribute("href")) {
    return linkedinLink.getAttribute("href") || "";
  }
  return "";
};
