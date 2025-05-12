
import { API_BASE_URL, CUSTOM_API_BASE_URL } from "./config";
import { WordPressPage, CustomWordPressPage } from "./types";

// Fetch pages from WordPress API
export const fetchPages = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages?_embed`);
    
    if (!response.ok) {
      console.error(`Error fetching pages: HTTP ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching pages: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    // Removed toast notification
    return [];
  }
};

// Fetch a specific page by slug
export const fetchPageBySlug = async (slug: string): Promise<WordPressPage | null> => {
  try {
    console.log(`Fetching page with slug "${slug}" from standard WordPress API`);
    const response = await fetch(`${API_BASE_URL}/pages?_embed&slug=${slug}`);
    
    if (!response.ok) {
      console.error(`Error fetching page "${slug}": HTTP ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching page: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Format the response to include the featured media URL directly
      const page = data[0];
      const featuredMediaUrl = page._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      
      console.log(`Successfully fetched page "${slug}" from standard API`);
      
      return {
        ...page,
        featured_media_url: featuredMediaUrl
      };
    }
    
    console.log(`Page "${slug}" not found in standard WordPress API`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch page with slug "${slug}" from standard API:`, error);
    // Removed toast notification
    return null;
  }
};

// Fetch page from custom WordPress API endpoint
export const fetchCustomPageBySlug = async (slug: string): Promise<CustomWordPressPage | null> => {
  try {
    console.log(`Fetching page with slug "${slug}" from custom API endpoint`);
    const response = await fetch(`${CUSTOM_API_BASE_URL}/page?slug=${slug}`);
    
    // Log response status for debugging
    console.log(`Custom API response for "${slug}": ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Custom API endpoint not found: ${CUSTOM_API_BASE_URL}/page?slug=${slug}`);
        throw new Error(`Custom API endpoint not found: ${response.statusText}`);
      } else {
        console.error(`Error fetching custom page "${slug}": HTTP ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching custom page: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    console.log(`Successfully fetched page "${slug}" from custom API`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch custom page with slug "${slug}":`, error);
    throw error; // Re-throw to allow the calling function to handle it
  }
};

// Extract a specific section from a page by its selector
export const extractSectionFromPage = async (
  slug: string, 
  selector: string
): Promise<string | null> => {
  try {
    // Try custom API first, then fall back to standard API if needed
    let pageContent = null;
    
    try {
      const customPage = await fetchCustomPageBySlug(slug);
      if (customPage?.content) {
        pageContent = customPage.content;
      }
    } catch (error) {
      console.log(`Custom API failed for extractSection, trying standard API as fallback`);
      const standardPage = await fetchPageBySlug(slug);
      if (standardPage?.content?.rendered) {
        pageContent = standardPage.content.rendered;
      }
    }
    
    if (!pageContent) return null;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageContent, "text/html");
    const section = doc.querySelector(selector);
    
    return section ? section.outerHTML : null;
  } catch (error) {
    console.error(`Failed to extract section from page "${slug}":`, error);
    return null;
  }
};
