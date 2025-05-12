
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

    console.log(`Property ${id}: Récupération des données principales réussie`);

    // 2) On récupère séparément toutes les images attachées (parent = post ID)
    // Le paramètre media_type=image assure qu'on ne récupère que des images
    const mediaRes = await fetch(`${API_BASE_URL}/media?parent=${id}&per_page=50&media_type=image`);
    const attsCount = mediaRes.headers.get('x-wp-total') || 'unknown';

    console.log(`Property ${id}: ${attsCount} médias attachés trouvés`);

    if (mediaRes.ok) {
      const atts: any[] = await mediaRes.json();
      console.log(`Property ${id}: Médias attachés récupérés avec succès`, 
        atts.map(a => ({ id: a.id, url: a.source_url })));

      // Initialiser ou remplacer le tableau wp:attachment
      if (!data._embedded) {
        data._embedded = {};
      }
      
      data._embedded["wp:attachment"] = atts;

      // Vérifier si les médias ont été correctement ajoutés
      console.log(`Property ${id}: ${data._embedded["wp:attachment"]?.length || 0} attachments intégrés dans l'objet`);
    } else {
      console.warn(`Property ${id}: Échec de récupération des attachements:`, mediaRes.status);
    }

    // 3) On transforme l'objet complet
    const transformed = transformPropertyData(data);
    console.log(`Property ${id}: Transformation terminée, ${transformed.allImages.length} images disponibles`);
    
    // Log des URLs d'images pour débogage
    console.log(`Property ${id}: URLs des images:`, transformed.allImages);

    return transformed;
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};

// Exporter transformPropertyData pour résoudre l'erreur d'importation
export { transformPropertyData } from "./transformers";
