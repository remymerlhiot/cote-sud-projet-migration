
import { toast } from "@/components/ui/sonner";
import { WordPressAnnonce, AcfData, NormalizedProperty } from "@/types";
import { normalizePropertyData } from "./wordpress/transformers";
import { API_BASE_URL, DEFAULT_IMAGE } from "./wordpress/config";

// Exporter les types pour qu'ils soient utilisables par d'autres modules
export type { NormalizedProperty };

// 1. Liste WP REST
export const fetchAnnoncesList = async (): Promise<WordPressAnnonce[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/annonce?_embed&per_page=40`);
    if (!res.ok) throw new Error(res.statusText);
    const annonces = await res.json();
    
    // Log des statistiques de galeries
    const withGalerie = annonces.filter((p: WordPressAnnonce) => 
      p.galerie_elementor && p.galerie_elementor.length > 0).length;
    console.log(`FluxApi: ${annonces.length} annonces récupérées, dont ${withGalerie} avec galerie_elementor`);
    
    return annonces;
  } catch (e) {
    console.error("Erreur lors de la récupération des annonces:", e);
    toast.error("Impossible de récupérer la liste des annonces");
    return [];
  }
};

// 2. ACF
export const fetchAcfData = async (id: number): Promise<AcfData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/acf/v3/posts/${id}`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  } catch {
    return null;
  }
};

// 3. Attachments
export const fetchAttachments = async (postId: number): Promise<string[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/media?parent=${postId}&per_page=50`);
    if (!res.ok) return [];
    const medias = await res.json();
    return medias.map((m: any) => m.source_url);
  } catch {
    return [];
  }
};

// 4. Tout récupérer et normaliser
export const fetchAllAnnonces = async (): Promise<NormalizedProperty[]> => {
  try {
    const annonces = await fetchAnnoncesList();
    console.log(`FluxApi: Récupéré ${annonces.length} annonces brutes`);
    
    if (annonces.length === 0) {
      console.error("FluxApi: Aucune annonce récupérée, vérifier l'API");
      return [];
    }
    
    const props = await Promise.all(
      annonces.map(async annonce => {
        const acf = await fetchAcfData(annonce.id);
        let np = normalizePropertyData(annonce, acf);
        
        // fallback attachments uniquement si on n'a pas d'images
        if (np.allImages.length === 1 && np.allImages[0] === DEFAULT_IMAGE) {
          const attached = await fetchAttachments(annonce.id);
          if (attached.length) {
            np.allImages = attached;
            np.image = attached[0];
          }
        }
        return np;
      })
    );
    
    console.log(`FluxApi: Traitement terminé, ${props.length} propriétés normalisées`);
    return props.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Erreur globale dans fetchAllAnnonces:", error);
    return [];
  }
};
