
/**
 * Utility functions to clean and process Elementor-generated HTML content
 * for better display in React components
 */

/**
 * Cleans Elementor HTML by removing unnecessary classes and simplifying structure
 * @param html - The raw HTML content from WordPress/Elementor
 * @param options - Configuration options for cleaning
 * @returns Cleaned HTML string
 */
export const cleanElementorHtml = (
  html: string,
  options: CleaningOptions = defaultCleaningOptions
): string => {
  if (!html) return "";
  
  let cleanedHtml = html;

  // Create a DOM parser to work with the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanedHtml, "text/html");

  // Remove unwanted Elementor classes if enabled
  if (options.removeElementorClasses) {
    removeElementorClasses(doc);
  }

  // Clean up empty divs and unnecessary nesting if enabled
  if (options.simplifyStructure) {
    simplifyStructure(doc);
  }

  // Ensure images are responsive
  if (options.makeImagesResponsive) {
    makeImagesResponsive(doc);
  }

  // Fix links if enabled
  if (options.fixLinks) {
    fixLinks(doc, options.baseDomain);
  }

  // Convert back to HTML string
  cleanedHtml = doc.body.innerHTML;

  return cleanedHtml;
};

/**
 * Removes Elementor-specific CSS classes
 */
const removeElementorClasses = (doc: Document): void => {
  // Target Elementor-specific classes
  const elementorClassPatterns = [
    /^elementor-/,
    /^e-/,
    /^eicon-/,
    /^elementor$/,
  ];
  
  // Find all elements with class attributes
  const elementsWithClass = doc.querySelectorAll("[class]");
  
  elementsWithClass.forEach((element) => {
    const classList = element.classList;
    const classesToRemove: string[] = [];
    
    // Identify Elementor classes to remove
    for (let i = 0; i < classList.length; i++) {
      const className = classList[i];
      if (elementorClassPatterns.some(pattern => pattern.test(className))) {
        classesToRemove.push(className);
      }
    }
    
    // Remove identified classes
    classesToRemove.forEach(className => {
      element.classList.remove(className);
    });
    
    // If no classes left, remove the class attribute
    if (element.classList.length === 0) {
      element.removeAttribute("class");
    }
  });
};

/**
 * Simplifies the DOM structure by removing empty divs and unnecessary nesting
 */
const simplifyStructure = (doc: Document): void => {
  // Remove empty divs (only containing whitespace or nothing)
  const allDivs = doc.querySelectorAll("div");
  allDivs.forEach((div) => {
    if (!div.textContent?.trim() && div.children.length === 0) {
      div.parentNode?.removeChild(div);
    }
  });

  // Unwrap unnecessary nested divs (div > div with no other siblings or attributes)
  const nestedDivs = doc.querySelectorAll("div > div:only-child");
  nestedDivs.forEach((div) => {
    const parent = div.parentNode as HTMLElement;
    if (parent && parent.tagName === "DIV" && parent.attributes.length === 0) {
      // Move all children up to parent
      while (div.firstChild) {
        parent.insertBefore(div.firstChild, div);
      }
      // Remove the empty nested div
      parent.removeChild(div);
    }
  });
};

/**
 * Makes images responsive by adding appropriate classes
 */
const makeImagesResponsive = (doc: Document): void => {
  const images = doc.querySelectorAll("img");
  images.forEach((img) => {
    // Add responsive class to images
    img.classList.add("w-full", "h-auto", "object-cover");
    
    // If a parent is a figure, make it responsive too
    if (img.parentElement?.tagName === "FIGURE") {
      img.parentElement.classList.add("w-full");
    }
  });
};

/**
 * Fixes relative links to absolute links
 */
const fixLinks = (doc: Document, baseDomain?: string): void => {
  if (!baseDomain) return;
  
  const links = doc.querySelectorAll("a[href]");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("/") && !href.startsWith("//")) {
      link.setAttribute("href", `${baseDomain}${href}`);
    }
  });
};

export interface CleaningOptions {
  removeElementorClasses: boolean;
  simplifyStructure: boolean;
  makeImagesResponsive: boolean;
  fixLinks: boolean;
  baseDomain?: string;
}

export const defaultCleaningOptions: CleaningOptions = {
  removeElementorClasses: true,
  simplifyStructure: true,
  makeImagesResponsive: true,
  fixLinks: true,
  baseDomain: "https://cote-sud.immo",
};

/**
 * Extracts specific sections from Elementor content
 * @param html - The HTML content
 * @param sectionId - ID of the section to extract (CSS selector)
 * @returns The HTML string of the extracted section
 */
export const extractElementorSection = (
  html: string,
  sectionId: string
): string => {
  if (!html) return "";
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  const section = doc.querySelector(sectionId);
  return section ? section.innerHTML : "";
};
