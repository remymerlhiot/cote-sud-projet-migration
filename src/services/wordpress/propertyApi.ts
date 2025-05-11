import { toast } from "@/components/ui/sonner";
import { API_BASE_URL } from "./config";
import { WordPressProperty } from "./types";
import { transformPropertyData } from "./transformers";
import { TransformedProperty } from "./types";

/**
 * Récupère toutes les propriétés (liste)
 */
export const fetchProperties = async (): Promise<TransformedProperty[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/annonce?_embed&per_page=40`);
    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.statusText}`);
    }
    const data: WordPressProperty[] = await response.json();
    return data.map(transformPropertyData);
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    toast.error("Impossible de récupérer les biens immobiliers");
    return [];
  }
};

/**
 * Récupère une propriété par son ID, et injecte
 * dans `_embedded["wp:attachment"]` la liste de tous
 * les médias attachés au post (pour Elementor carousel).
 */
export const fetchPropertyById = async (id: number): Promise<TransformedProperty | null> => {
  try {
    // 1) On charge d’abord la donnée principale avec featuredmedia
    const res = await fetch(`${API_BASE_URL}/annonce/${id}?_embed`);
    if (!res.ok) throw new Error(res.statusText);
    const data: any = await res.json();

    // 2) On récupère toutes les images attachées (parent = post ID)
    const mediaRes = await fetch(`${API_BASE_URL}/wp/v2/media?parent=${id}&per_page=50`);
    if (mediaRes.ok) {
      const atts: any[] = await mediaRes.json();
      data._embedded = {
        ...data._embedded,
        "wp:attachment": atts
      };
    } else {
      console.warn(`No attachments fetched for property ${id}:`, mediaRes.status);
    }

    console.log(`Property ${id} attachments:`, data._embedded["wp:attachment"]);

    // 3) On transforme l’objet complet
    return transformPropertyData(data);
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};
