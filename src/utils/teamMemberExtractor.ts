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
  
  // Look for team sections first to context-scope our search
  const teamSections = findTeamSections(doc);
  
  if (teamSections.length > 0) {
    // If we found team sections, extract members from each section
    teamSections.forEach(section => {
      const membersFromSection = extractMembersFromSection(section);
      extractedMembers.push(...membersFromSection);
    });
    
    if (extractedMembers.length > 0) {
      return extractedMembers;
    }
  }
  
  // Fallback: look for images that might be team members throughout the page
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
          
          // Determine image position (if available in data attributes)
          const imagePosition = img.getAttribute("data-position") || 
                                img.style.objectPosition || "center";
          
          // Add to extracted members if basic info is available
          if (name && (phone || email)) {
            extractedMembers.push({
              name,
              phone: phone || "Numéro non disponible",
              email,
              linkedin,
              role,
              imageUrl,
              imagePosition,
              imageSize: determineImageSize(img)
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
 * Find sections that might contain team members
 */
const findTeamSections = (doc: Document): Element[] => {
  const teamSections: Element[] = [];
  
  // Common selectors for team sections
  const selectors = [
    "#equipe", "#notre-equipe", "#team", "#notre-team", ".team-section", ".equipe",
    "section:has(h2:contains('équipe'))", "section:has(h2:contains('Équipe'))", 
    "section:has(h2:contains('team'))", "section:has(h2:contains('Team'))",
    "div.elementor-section:has(h2:contains('équipe'))"
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => teamSections.push(el));
    } catch (e) {
      // Some selectors might not work in all browsers
      console.debug(`Selector failed: ${selector}`, e);
    }
  });
  
  return teamSections;
};

/**
 * Extract team members from a specific section
 */
const extractMembersFromSection = (section: Element): TeamMemberProps[] => {
  const members: TeamMemberProps[] = [];
  
  // Look for common team member container patterns
  const memberContainers = section.querySelectorAll(".team-member, .elementor-team-member, .team-item, .membre");
  
  if (memberContainers.length > 0) {
    memberContainers.forEach(container => {
      const name = findNameInContainer(container);
      if (name) {
        const phone = extractPhone(container);
        const email = extractEmail(container);
        const role = extractRole(container, name);
        const linkedin = extractLinkedIn(container);
        
        // Try to find image
        const img = container.querySelector("img");
        const imageUrl = img ? img.getAttribute("src") || "" : "";
        const imagePosition = img ? img.getAttribute("data-position") || img.style.objectPosition || "center" : "center";
        
        if (name && (phone || email)) {
          members.push({
            name,
            phone: phone || "Numéro non disponible",
            email,
            linkedin,
            role,
            imageUrl,
            imagePosition,
            imageSize: img ? determineImageSize(img) : "medium"
          });
        }
      }
    });
  }
  
  return members;
};

/**
 * Determine image size category based on dimensions
 */
const determineImageSize = (img: HTMLImageElement): "small" | "medium" | "large" => {
  // Try to get size from data attribute first
  const sizeAttr = img.getAttribute("data-size");
  if (sizeAttr && ["small", "medium", "large"].includes(sizeAttr)) {
    return sizeAttr as "small" | "medium" | "large";
  }
  
  // Calculate based on actual dimensions if available
  const width = img.width || img.naturalWidth || 0;
  
  if (width < 100) return "small";
  if (width > 200) return "large";
  return "medium";
};

/**
 * Find name in a container element - Improved to prioritize formatting and structure
 */
const findNameInContainer = (container: Element): string => {
  // Strategy 1: Look for elements with explicit name classes
  const nameEls = container.querySelectorAll(".name, .team-name, .member-name, .agent-name");
  for (const el of nameEls) {
    if (el.textContent?.trim()) {
      return el.textContent.trim();
    }
  }
  
  // Strategy 2: Look for elements with heading tags - most likely to contain names
  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const heading of headings) {
    // Verify this isn't a section heading (like "Notre équipe")
    const headingText = heading.textContent?.trim() || "";
    if (headingText && 
        !headingText.toLowerCase().includes("équipe") && 
        !headingText.toLowerCase().includes("equipe") &&
        !headingText.toLowerCase().includes("team")) {
      return headingText;
    }
  }
  
  // Strategy 3: Look for emphasized text that might be a name
  const emphasisEls = container.querySelectorAll("strong, b, .text-bold, .font-bold");
  for (const el of emphasisEls) {
    const text = el.textContent?.trim() || "";
    // Simple validation: length < 40 chars, no @ symbols or phone numbers
    if (text && 
        text.length < 40 && 
        !text.includes('@') && 
        !(/\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/).test(text)) {
      return text;
    }
  }
  
  // Strategy 4: First paragraph if it's short and likely a name
  const paragraphs = container.querySelectorAll("p");
  for (const p of paragraphs) {
    const text = p.textContent?.trim() || "";
    if (text && 
        text.length < 40 && 
        !text.includes('@') && 
        !(/\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/).test(text)) {
      return text;
    }
  }
  
  return "";
};

/**
 * Extract phone number from container - Improved with multiple formats
 */
const extractPhone = (container: Element): string => {
  // Strategy 1: Find tel links
  const phoneLinks = container.querySelectorAll("a[href^='tel:']");
  for (const link of phoneLinks) {
    const href = link.getAttribute("href") || "";
    const phone = href.replace('tel:', '');
    if (phone) return phone;
  }
  
  // Strategy 2: Find elements with phone-related classes
  const phoneEls = container.querySelectorAll(".phone, .tel, .telephone, .mobile");
  for (const el of phoneEls) {
    const text = el.textContent?.trim() || "";
    if (text) {
      // Keep only digits and formatting
      const cleaned = text.replace(/[^\d\s+.-]/g, '');
      if (cleaned) return cleaned;
    }
  }
  
  // Strategy 3: Regex search for various phone formats in all text content
  const text = container.textContent || "";
  
  // French mobile pattern (06, 07)
  const mobileMatch = text.match(/(?:06|07|33\s?6|33\s?7|0033\s?6|0033\s?7)[.\s]?(\d{2})[.\s]?(\d{2})[.\s]?(\d{2})[.\s]?(\d{2})/);
  if (mobileMatch) return mobileMatch[0];
  
  // Standard French landline pattern
  const landlineMatch = text.match(/(?:01|02|03|04|05|08|09|33\s?1|33\s?2|33\s?3|33\s?4|33\s?5|33\s?8|33\s?9)[.\s]?(\d{2})[.\s]?(\d{2})[.\s]?(\d{2})[.\s]?(\d{2})/);
  if (landlineMatch) return landlineMatch[0];
  
  // Generic number pattern (10 digits)
  const genericMatch = text.match(/\b\d{2}[.\s]?\d{2}[.\s]?\d{2}[.\s]?\d{2}[.\s]?\d{2}\b/);
  if (genericMatch) return genericMatch[0];
  
  return "";
};

/**
 * Extract email from container
 */
const extractEmail = (container: Element): string => {
  // Look for email in href
  const emailLinks = container.querySelectorAll("a[href^='mailto:']");
  for (const link of emailLinks) {
    const href = link.getAttribute("href") || "";
    return href.replace('mailto:', '');
  }
  
  // Look for email in elements with email-related classes
  const emailEls = container.querySelectorAll(".email, .mail");
  for (const el of emailEls) {
    const text = el.textContent?.trim() || "";
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) return emailMatch[0];
  }
  
  // Look for email in any text content
  const text = container.textContent || "";
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) return emailMatch[0];
  
  return "";
};

/**
 * Extract role/position from container
 */
const extractRole = (container: Element, name: string): string => {
  // Strategy 1: Find elements with explicit role classes
  const roleEls = container.querySelectorAll(".role, .position, .job-title, .titre, .fonction");
  for (const el of roleEls) {
    const text = el.textContent?.trim() || "";
    if (text && text !== name) return text;
  }
  
  // Strategy 2: Look for paragraphs or spans that might contain roles
  const potentialRoleEls = container.querySelectorAll("p, span");
  for (const el of potentialRoleEls) {
    const text = el.textContent?.trim() || "";
    
    // Simple validation for role text
    if (text && 
        text !== name && 
        text.length < 50 &&
        !text.includes('@') && 
        !(/\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/).test(text)) {
      
      // Additional validation - likely role keywords
      const roleKeywords = ['directeur', 'directrice', 'agent', 'conseiller', 'conseillère', 
                           'responsable', 'manager', 'consultant', 'consultante', 'spécialiste', 
                           'immobilier', 'assistant', 'assistante', 'commercial'];
      
      const lowerText = text.toLowerCase();
      if (roleKeywords.some(keyword => lowerText.includes(keyword))) {
        return text;
      }
      
      // If element has specific styling that might indicate a role
      const classList = el.classList.toString().toLowerCase();
      if (classList.includes('subtitle') || classList.includes('sub') || 
          classList.includes('role') || classList.includes('position') ||
          classList.includes('small') || classList.includes('light')) {
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
  // Strategy 1: Find direct LinkedIn links
  const linkedinLinks = container.querySelectorAll("a[href*='linkedin.com']");
  if (linkedinLinks.length > 0) {
    return linkedinLinks[0].getAttribute("href") || "";
  }
  
  // Strategy 2: Find social media icons that might be LinkedIn
  const socialLinks = container.querySelectorAll("a.linkedin, a.social-linkedin, a[aria-label*='LinkedIn'], a[title*='LinkedIn']");
  if (socialLinks.length > 0) {
    return socialLinks[0].getAttribute("href") || "";
  }
  
  return "";
};
