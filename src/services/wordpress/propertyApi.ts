
import { toast } from "@/components/ui/sonner";
import { API_BASE_URL } from "./config";
import { WordPressProperty } from "./types";
import { transformPropertyData } from "./transformers";
import { TransformedProperty } from "./types";

// Fetch properties from WordPress API (using the 'annonce' endpoint)
export const fetchProperties = async (): Promise<TransformedProperty[]> => {
  try {
    // Using _embed to include featured media in the response and increase per_page to get more properties
    const response = await fetch(`${API_BASE_URL}/annonce?_embed&per_page=20`);
    
    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Debug log to see the actual structure of the data
    if (data && data.length > 0) {
      console.log("WordPress API Response Total Properties:", data.length);
      console.log("WordPress API Complete First Property:", data[0]);
      
      // Add additional logging to see all available fields
      console.log("Available fields at root level:", Object.keys(data[0]));
      
      // Try to find non-null values for important fields by checking all properties
      const allProperties = [...data];
      
      // Find a property with non-null values for key fields
      const propertyWithPrice = allProperties.find(p => p.prix !== null || p.prix_affiche !== null);
      const propertyWithSurface = allProperties.find(p => p.surf_hab !== null);
      const propertyWithRooms = allProperties.find(p => p.piece !== null);
      const propertyWithBedrooms = allProperties.find(p => p.nb_chambre !== null);
      
      console.log("Example property with price:", propertyWithPrice?.id, propertyWithPrice?.prix || propertyWithPrice?.prix_affiche);
      console.log("Example property with surface:", propertyWithSurface?.id, propertyWithSurface?.surf_hab);
      console.log("Example property with rooms:", propertyWithRooms?.id, propertyWithRooms?.piece);
      console.log("Example property with bedrooms:", propertyWithBedrooms?.id, propertyWithBedrooms?.nb_chambre);
    }
    
    // Transform properties before returning
    const transformedProperties = data.map((property: WordPressProperty) => transformPropertyData(property));
    return transformedProperties;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    toast.error("Impossible de récupérer les biens immobiliers");
    // Return fallback data in case of error
    return [];
  }
};

// Fetch a single property by ID
export const fetchPropertyById = async (id: number): Promise<TransformedProperty | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonce/${id}?_embed`);
    
    if (!response.ok) {
      throw new Error(`Error fetching property: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Full property data for ID ${id}:`, data);
    return transformPropertyData(data);
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};

// Re-exporter explicitement la fonction transformPropertyData
export { transformPropertyData } from "./transformers";
