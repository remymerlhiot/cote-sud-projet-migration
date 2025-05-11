
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
    // 1) On charge d'abord la donnée principale avec featuredmedia
    const res = await fetch(`${API_BASE_URL}/annonce/${id}?_embed`);
    if (!res.ok) throw new Error(res.statusText);
    const data: any = await res.json();

    console.log(`Property ${id} initial data:`, {
      has_featured: !!data._embedded?.["wp:featuredmedia"],
      has_attachments: !!data._embedded?.["wp:attachment"],
    });

    // 2) On récupère toutes les images attachées (parent = post ID)
    const mediaRes = await fetch(`${API_BASE_URL}/media?parent=${id}&per_page=50`);
    const attsCount = mediaRes.headers.get('x-wp-total') || 'unknown';

    console.log(`Property ${id} found ${attsCount} attached media items`);

    if (mediaRes.ok) {
      const atts: any[] = await mediaRes.json();
      console.log(`Property ${id} attached media:`, 
        atts.map(a => ({ id: a.id, url: a.source_url })));

      // Initialiser le tableau wp:attachment s'il n'existe pas encore
      if (!data._embedded) {
        data._embedded = {};
      }
      
      data._embedded["wp:attachment"] = atts;

      // Vérifier si les médias ont été correctement ajoutés
      console.log(`Property ${id} now has ${data._embedded["wp:attachment"]?.length || 0} attachments`);
    } else {
      console.warn(`No attachments fetched for property ${id}:`, mediaRes.status);
    }

    // 3) On transforme l'objet complet
    const transformed = transformPropertyData(data);
    console.log(`Property ${id} transformed, images count:`, transformed.allImages.length);
    
    // Log pour débogage des images
    console.log(`Property ${id} image URLs:`, transformed.allImages);

    return transformed;
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};
