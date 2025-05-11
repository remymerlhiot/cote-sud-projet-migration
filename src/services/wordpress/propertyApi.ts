import { toast } from "@/components/ui/sonner";
import { API_BASE_URL } from "./config";
import { WordPressProperty } from "./types";
import { transformPropertyData } from "./transformers";
import { TransformedProperty } from "./types";

// On demande à WP d’embedder à la fois featuredmedia ET attachment
const EMBED_PARAMS = "_embed=wp:featuredmedia,wp:attachment";

export const fetchProperties = async (): Promise<TransformedProperty[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/annonce?${EMBED_PARAMS}&per_page=40`
    );
    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.statusText}`);
    }
    const data: WordPressProperty[] = await response.json();

    // Debug
    console.log("WP total props:", data.length);

    return data.map(transformPropertyData);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    toast.error("Impossible de récupérer les biens immobiliers");
    return [];
  }
};

export const fetchPropertyById = async (
  id: number
): Promise<TransformedProperty | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/annonce/${id}?${EMBED_PARAMS}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching property: ${response.statusText}`);
    }
    const data: WordPressProperty = await response.json();
    console.log(`WP single prop #${id}:`, data);
    return transformPropertyData(data);
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien");
    return null;
  }
};
