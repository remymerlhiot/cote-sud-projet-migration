
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { TransformedProperty } from "./wordpress/types";

export interface FTPProperty {
  id: string;
  reference: string;
  type: string;
  title: string;
  description: string;
  price: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  surface: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  constructionYear: string;
  features: {
    hasBalcony: boolean;
    hasPool: boolean;
    hasElevator: boolean;
    hasGarage: boolean;
    hasTerrasse: boolean;
  };
  photos: string[];
  dpe: string;
}

// Fetch properties from the FTP service via our edge function
export const fetchProperties = async (): Promise<FTPProperty[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-properties');
    
    if (error) {
      throw new Error(`Error fetching properties: ${error.message}`);
    }
    
    // Debug log to see the actual structure of the data
    if (data && data.properties && data.properties.length > 0) {
      console.log("FTP API Complete Property Response:", data.properties[0]);
    }
    
    return data.properties || [];
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    toast.error("Impossible de récupérer les biens immobiliers");
    // Return fallback data in case of error
    return [];
  }
};

// Fetch a single property by ID
export const fetchPropertyById = async (id: string): Promise<FTPProperty | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-properties');
    
    if (error) {
      throw new Error(`Error fetching properties: ${error.message}`);
    }
    
    // Find the specific property by ID
    const property = data.properties.find((p: FTPProperty) => p.id === id);
    
    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
    }
    
    return property;
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};

// Transform FTP property data to match our existing format
export const transformFTPPropertyData = (ftpProperty: FTPProperty): TransformedProperty => {
  // Helper to format price
  const formatPrice = (price: string): string => {
    // Remove non-numeric characters and convert to number
    const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    
    // Format with spaces for thousands
    const formattedPrice = numericPrice.toLocaleString('fr-FR');
    
    return `${formattedPrice} €`;
  };

  return {
    id: parseInt(ftpProperty.id) || 0,
    title: ftpProperty.type || ftpProperty.title || "Propriété",
    location: ftpProperty.city || "Non spécifié",
    ref: ftpProperty.reference || `REF ${ftpProperty.id}`,
    price: formatPrice(ftpProperty.price),
    priceNumber: parseInt(ftpProperty.price.replace(/[^0-9]/g, '')) || 0,
    area: ftpProperty.surface ? `${ftpProperty.surface}m²` : "Non spécifié",
    rooms: ftpProperty.rooms || "Non spécifié",
    bedrooms: ftpProperty.bedrooms || "Non spécifié",
    image: ftpProperty.photos && ftpProperty.photos.length > 0 
      ? ftpProperty.photos[0] 
      : "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png", // Fallback image
    date: new Date().toISOString(), // Using current date as fallback
    description: ftpProperty.description || "",
    fullContent: ftpProperty.description || "",
    propertyType: ftpProperty.type || "Non spécifié",
    constructionYear: ftpProperty.constructionYear || "",
    hasBalcony: ftpProperty.features?.hasBalcony || false,
    hasElevator: ftpProperty.features?.hasElevator || false,
    hasTerrasse: ftpProperty.features?.hasTerrasse || false,
    hasPool: ftpProperty.features?.hasPool || false,
    garageCount: ftpProperty.features?.hasGarage ? "1" : "0",
    dpe: ftpProperty.dpe || "",
    postalCode: ftpProperty.postalCode || "",
    address: ftpProperty.address || "",
    bathrooms: ftpProperty.bathrooms || "",
    country: ftpProperty.country || "France",
    landArea: "",
    floorNumber: "",
    totalFloors: "",
    toilets: "",
    heatingType: "",
    isNewConstruction: false,
    isPrestigious: false,
  };
};
