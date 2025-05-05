
import { toast } from "@/components/ui/sonner";
import { API_BASE_URL, CUSTOM_API_BASE_URL } from "./config";
import { WordPressPage, CustomWordPressPage } from "./types";

// Fetch pages from WordPress API
export const fetchPages = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages?_embed`);
    
    if (!response.ok) {
      throw new Error(`Error fetching pages: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    toast.error("Impossible de récupérer les pages");
    return [];
  }
};

// Fetch a specific page by slug
export const fetchPageBySlug = async (slug: string): Promise<WordPressPage | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages?_embed&slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching page: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      // Format the response to include the featured media URL directly
      const page = data[0];
      const featuredMediaUrl = page._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
      
      return {
        ...page,
        featured_media_url: featuredMediaUrl
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch page with slug "${slug}":`, error);
    toast.error("Impossible de récupérer la page");
    return null;
  }
};

// Fetch page from custom WordPress API endpoint
export const fetchCustomPageBySlug = async (slug: string): Promise<CustomWordPressPage | null> => {
  try {
    const response = await fetch(`${CUSTOM_API_BASE_URL}/page?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching custom page: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch custom page with slug "${slug}":`, error);
    toast.error("Impossible de récupérer la page personnalisée");
    return null;
  }
};

// Extract a specific section from a page by its selector
export const extractSectionFromPage = async (
  slug: string, 
  selector: string
): Promise<string | null> => {
  try {
    const page = await fetchCustomPageBySlug(slug);
    
    if (!page?.content) return null;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(page.content, "text/html");
    const section = doc.querySelector(selector);
    
    return section ? section.outerHTML : null;
  } catch (error) {
    console.error(`Failed to extract section from page "${slug}":`, error);
    return null;
  }
};
