
import { toast } from "@/components/ui/sonner";
import { API_BASE_URL } from "./config";
import { WordPressProperty } from "./types";

// Fetch properties from WordPress API (using the 'annonce' endpoint)
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
