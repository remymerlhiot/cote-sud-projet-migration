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
  
  // Add direct property fields to match API response structure
  mandat?: string;
  ville?: string;
  localisation?: string;
  prix?: string;
  prix_affiche?: string;
  surf_hab?: string;
  piece?: string;
  nb_chambre?: string;
  dpe_lettre_consom_energ?: string;
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
  reference?: string; // Unique reference field
  
  // Keep the ACF object for backward compatibility
  acf?: {
    // Original fields (keeping for backward compatibility)
    location?: string;
    price?: string;
    area?: string;
    rooms?: string;
    bedrooms?: string;
    dpe?: string;
    
    // WordPress ACF field names
    mandat?: string;
    ville?: string;
    localisation?: string;
    prix?: string;
    prix_affiche?: string;
    surf_hab?: string;
    piece?: string;
    nb_chambre?: string;
    dpe_lettre_consom_energ?: string;
    
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
    reference?: string;
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

// Définition du type pour la propriété transformée
export interface TransformedProperty {
  id: number;
  title: string;
  location: string;
  ref: string;
  price: string;
  priceNumber: number;
  area: string;
  rooms: string;
  bedrooms: string;
  dpe: string;
  image: string;
  date: string;
  description: string;
  fullContent: string;
  propertyType: string;
  constructionYear: string;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasTerrasse: boolean;
  hasPool: boolean;
  garageCount: string;
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
      
      // Add additional logging to see all available fields
      console.log("Available fields at root level:", Object.keys(data[0]));
      
      // Log some specific fields we're interested in
      console.log("Property mandat:", data[0]?.mandat);
      console.log("Property ville:", data[0]?.ville);
      console.log("Property prix:", data[0]?.prix);
      console.log("Property prix_affiche:", data[0]?.prix_affiche);
      console.log("Property surf_hab:", data[0]?.surf_hab);
      console.log("Property piece:", data[0]?.piece);
      console.log("Property nb_chambre:", data[0]?.nb_chambre);
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
export const transformPropertyData = (wpProperty: WordPressProperty): TransformedProperty => {
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"; // Fallback image
  
  // Log the full property data for debugging
  console.log("Transforming property:", wpProperty.id);
  
  // Helper function to get field value as string, ensuring we always return a string
  const getFieldValue = (fieldName: string, fallback: string = "Non spécifié"): string => {
    // Get value from root level property
    const rootValue = wpProperty[fieldName as keyof WordPressProperty];
    // Get value from ACF property
    const acfValue = wpProperty.acf?.[fieldName as keyof (typeof wpProperty.acf)];
    
    // Check for root level value
    if (rootValue !== undefined && rootValue !== null) {
      if (typeof rootValue === 'string') return rootValue;
      if (typeof rootValue === 'number') return String(rootValue);
      // Handle rendered property carefully with type checking
      if (typeof rootValue === 'object' && rootValue !== null) {
        // Check if the object has a 'rendered' property
        const renderedObj = rootValue as unknown as { rendered?: string };
        if (renderedObj.rendered) {
          return renderedObj.rendered;
        }
      }
    }
    
    // Check for ACF value
    if (acfValue !== undefined && acfValue !== null) {
      if (typeof acfValue === 'string') return acfValue;
      if (typeof acfValue === 'number') return String(acfValue);
      // Handle rendered property carefully with type checking
      if (typeof acfValue === 'object' && acfValue !== null) {
        // Check if the object has a 'rendered' property
        const renderedObj = acfValue as unknown as { rendered?: string };
        if (renderedObj.rendered) {
          return renderedObj.rendered;
        }
      }
    }
    
    return fallback;
  };
  
  // Extract fields with the helper function
  const location = getFieldValue('ville') || getFieldValue('localisation') || getFieldValue('location');
  const reference = getFieldValue('mandat') || getFieldValue('reference') || `REF ${wpProperty.id}`;
  
  // Handle price - try different possible field names
  const priceString = getFieldValue('prix_affiche') || getFieldValue('prix') || getFieldValue('price') || "Prix sur demande";
  const priceNumber = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  
  // Handle area/surface - try different possible field names and ensure it has "m²"
  let area = getFieldValue('surf_hab') || getFieldValue('area') || getFieldValue('surface');
  if (area !== "Non spécifié" && !area.includes("m²")) {
    area = `${area}m²`;
  }
  
  // Handle rooms and bedrooms - try different possible field names
  const rooms = getFieldValue('piece') || getFieldValue('rooms');
  const bedrooms = getFieldValue('nb_chambre') || getFieldValue('bedrooms');
  
  // DPE rating - get the energy consumption letter
  const dpe = getFieldValue('dpe_lettre_consom_energ') || getFieldValue('dpe');
  
  // Extract content without HTML tags for a clean description
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = wpProperty.content.rendered;
  const contentText = tempDiv.textContent || tempDiv.innerText || "";
  const shortDescription = contentText.substring(0, 150) + "...";
  
  // Additional property details using the helper function
  const propertyType = getFieldValue('type');
  const constructionYear = getFieldValue('annee_constr');
  const hasBalcony = getFieldValue('balcon') === "1";
  const hasElevator = getFieldValue('ascenseur') === "1";
  const hasTerrasse = getFieldValue('terrasse') === "1";
  const hasPool = getFieldValue('piscine') === "1";
  const garageCount = getFieldValue('nb_garage') || "0";
  
  // Handle title property carefully
  let title = "";
  if (typeof wpProperty.title === 'object' && wpProperty.title !== null && 'rendered' in wpProperty.title) {
    title = wpProperty.title.rendered;
  } else if (typeof wpProperty.title === 'string') {
    title = wpProperty.title;
  } else {
    title = "Propriété";
  }
  
  return {
    id: wpProperty.id,
    title: title,
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
