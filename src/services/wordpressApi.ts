import { toast } from "@/components/ui/sonner";

// Base URL for the WordPress API - replace with your actual WordPress site URL
const API_BASE_URL = "https://cote-sud.immo/wp-json/wp/v2";
const CUSTOM_API_BASE_URL = "https://cote-sud.immo/wp-json/axo/v1";

// Types for WordPress API responses
export interface WordPressProperty {
  id: number;
  date?: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  acf: {
    // Original fields (keeping for backward compatibility)
    location?: string;
    price?: string;
    area?: string;
    rooms?: string;
    bedrooms?: string;
    dpe?: string;
    
    // WordPress ACF field names from the actual implementation
    mandat?: string;
    ville?: string;
    localisation?: string;
    prix?: string;
    prix_affiche?: string;
    surf_hab?: string;
    piece?: string;
    nb_chambre?: string;
    dpe_lettre_consom_energ?: string;
    
    // Removing duplicate reference field
    // reference?: string;  - Removed duplicate
    
    // Additional fields from the WordPress ACF list
    type_mandat?: string;
    operation?: string;
    famille?: string;
    type?: string;
    adresse?: string;
    code_postal?: string;
    pays?: string;
    prestige?: string;
    neuf?: string;
    surf_terrain?: string;
    nb_etage?: string;
    num_etage?: string;
    nb_sdb?: string;
    nb_salle_deau?: string;
    nb_wc?: string;
    chauffage?: string;
    balcon?: string;
    ascenseur?: string;
    nb_garage?: string;
    terrasse?: string;
    piscine?: string;
    annee_constr?: string;
    texte_fr?: string;
    reference?: string; // Single reference field
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

export interface WordPressAnnonce extends WordPressProperty {
  // Add any specific fields for the 'annonce' post type
  // The structure is largely the same as WordPressProperty
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

export interface WordPressPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  featured_media_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

// New interface for the custom endpoint response
export interface CustomWordPressPage {
  title: string;
  content: string;
  featured_image: string | null;
  elementor_data: string | null;
  media_list: string[];
}

// Fetch properties from WordPress API (now using the 'annonce' endpoint)
export const fetchProperties = async (): Promise<WordPressProperty[]> => {
  try {
    // Using _embed to include featured media in the response and the annonce endpoint
    const response = await fetch(`${API_BASE_URL}/annonce?_embed&per_page=10`);
    
    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Debug log to see the actual structure of the data
    if (data && data.length > 0) {
      console.log("WordPress API Complete Property Response:", data[0]);
      console.log("WordPress API ACF Fields:", JSON.stringify(data[0]?.acf, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    toast.error("Impossible de récupérer les biens immobiliers");
    // Return fallback data in case of error
    return [];
  }
};

// Fetch a single property by ID
export const fetchPropertyById = async (id: number): Promise<WordPressProperty | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonce/${id}?_embed`);
    
    if (!response.ok) {
      throw new Error(`Error fetching property: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};

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

// Fetch media from WordPress API
export const fetchMedia = async (mediaId: number): Promise<WordPressMedia | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/${mediaId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching media: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch media #${mediaId}:`, error);
    return null;
  }
};

// Helper function to transform WordPress property data
export const transformPropertyData = (wpProperty: WordPressProperty) => {
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"; // Fallback image
  
  // Log the full property data for debugging
  console.log("Transforming property:", wpProperty.id);
  
  // Extract fields with fallbacks for ACF field naming conventions
  const location = wpProperty.acf?.ville || 
                   wpProperty.acf?.localisation || 
                   wpProperty.acf?.location || 
                   "Non spécifié";
  
  const reference = wpProperty.acf?.mandat || 
                    wpProperty.acf?.reference || 
                    `REF ${wpProperty.id}`;
  
  // Handle price - try different possible field names
  const priceString = wpProperty.acf?.prix_affiche || 
                      wpProperty.acf?.prix || 
                      wpProperty.acf?.price || 
                      "Prix sur demande";
  const priceNumber = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  
  // Handle area/surface - try different possible field names and ensure it has "m²"
  let area = wpProperty.acf?.surf_hab || wpProperty.acf?.area || "Non spécifié";
  if (area !== "Non spécifié" && !area.includes("m²")) {
    area = `${area}m²`;
  }
  
  // Handle rooms - try different possible field names
  const rooms = wpProperty.acf?.piece || wpProperty.acf?.rooms || "Non spécifié";
  
  // Handle bedrooms - try different possible field names
  const bedrooms = wpProperty.acf?.nb_chambre || wpProperty.acf?.bedrooms || "Non spécifié";
  
  // DPE rating - get the energy consumption letter
  const dpe = wpProperty.acf?.dpe_lettre_consom_energ || wpProperty.acf?.dpe || "";
  
  // Extract content without HTML tags for a clean description
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = wpProperty.content.rendered;
  const contentText = tempDiv.textContent || tempDiv.innerText || "";
  const shortDescription = contentText.substring(0, 150) + "...";
  
  // Additional property details
  const propertyType = wpProperty.acf?.type || "";
  const constructionYear = wpProperty.acf?.annee_constr || "";
  const hasBalcony = wpProperty.acf?.balcon === "1" ? true : false;
  const hasElevator = wpProperty.acf?.ascenseur === "1" ? true : false;
  const hasTerrasse = wpProperty.acf?.terrasse === "1" ? true : false;
  const hasPool = wpProperty.acf?.piscine === "1" ? true : false;
  const garageCount = wpProperty.acf?.nb_garage || "0";
  
  return {
    id: wpProperty.id,
    title: wpProperty.title.rendered || "",
    location: location,
    ref: reference,
    price: priceString,
    priceNumber: priceNumber,
    area: area,
    rooms: rooms,
    bedrooms: bedrooms,
    dpe: dpe,
    image: featuredImage,
    date: wpProperty.date || new Date().toISOString(),
    description: shortDescription,
    fullContent: wpProperty.content.rendered || "",
    propertyType: propertyType,
    constructionYear: constructionYear,
    hasBalcony: hasBalcony,
    hasElevator: hasElevator,
    hasTerrasse: hasTerrasse,
    hasPool: hasPool,
    garageCount: garageCount
  };
};
