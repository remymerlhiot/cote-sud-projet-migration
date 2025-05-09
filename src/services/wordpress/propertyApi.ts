
import { toast } from "@/components/ui/sonner";
import { API_BASE_URL } from "./config";
import { WordPressProperty } from "./types";
import { transformPropertyData } from "./transformers";
import { TransformedProperty } from "./types";

// Fetch properties from WordPress API (using the 'annonce' endpoint)
export const fetchProperties = async (): Promise<TransformedProperty[]> => {
  try {
    // Using _embed to include featured media in the response and increase per_page to get more properties
    const response = await fetch(`${API_BASE_URL}/annonce?_embed&per_page=40`);
    
    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Debug log to see the actual structure of the data
    if (data && data.length > 0) {
      console.log("WordPress API Response Total Properties:", data.length);
      console.log("WordPress API First Property ID:", data[0].id);
      console.log("Available fields at root level:", Object.keys(data[0]));
      
      // Find a sample property with complete data for analysis
      const sampleProperties = data.slice(0, 3);
      sampleProperties.forEach((prop, index) => {
        console.log(`Sample property ${index+1} ID:`, prop.id);
        console.log(`Sample property ${index+1} fields:`, 
          Object.keys(prop).filter(key => 
            prop[key] !== null && 
            prop[key] !== undefined && 
            prop[key] !== "" && 
            typeof prop[key] !== 'object'
          ).map(key => `${key}: ${prop[key]}`).join(", ")
        );
      });
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
    
    // Log all available fields and their values
    console.log(`Property ${id} available fields:`, Object.keys(data));
    console.log(`Property ${id} meta fields:`, data.meta || "No meta fields");
    
    // Transform property before returning
    return transformPropertyData(data);
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};

// Exporter explicitement la fonction transformPropertyData
export { transformPropertyData } from "./transformers";
