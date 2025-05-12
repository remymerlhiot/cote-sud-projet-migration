
// src/services/fluxApi.ts
import { toast } from "@/components/ui/sonner";

// Types pour les données brutes de l'API WordPress
interface WordPressAnnonce {
  id: number;
  title: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  date: string;
  _links?: {
    self: Array<{ href: string }>;
    "wp:featuredmedia"?: Array<{ href: string }>;
    [key: string]: any;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
}

// Type pour les champs ACF
interface AcfData {
  acf: {
    [key: string]: any;
    photos?: Array<{
      url: string;
      alt?: string;
    }>;
    prix?: string;
    surface?: string;
    ville?: string;
    pieces?: string;
    chambres?: string;
    reference?: string;
    // Pour une meilleure compatibilité avec différents noms de champs
    prix_vente?: string; 
    surf_hab?: string;
    localisation?: string;
    piece?: string;
    nb_chambre?: string;
    mandat?: string;
  };
}

// Type pour l'objet normalisé en sortie
export interface NormalizedProperty {
  id: number;
  titre: string;
  prix: string;
  ville: string;
  surface: string;
  pieces: string;
  chambres: string;
  reference: string;
  image: string;
  description: string;
  date: string;
  allImages: string[];
}

// Configuration de l'API
const API_BASE_URL = "https://agence-axo.immo/wp-json";
const DEFAULT_IMAGE = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";

/**
 * Récupère la liste des annonces depuis l'API WordPress standard
 */
export const fetchAnnoncesList = async (): Promise<WordPressAnnonce[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wp/v2/annonce?_embed&per_page=40`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des annonces: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Échec de la récupération des annonces:", error);
    toast.error("Impossible de récupérer la liste des annonces");
    return [];
  }
};

/**
 * Récupère les données ACF pour une annonce spécifique
 */
export const fetchAcfData = async (id: number): Promise<AcfData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/acf/v3/annonce/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données ACF: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Échec de la récupération des données ACF pour l'annonce #${id}:`, error);
    // Pas de toast ici pour éviter de spammer l'utilisateur si plusieurs annonces échouent
    return null;
  }
};

/**
 * Récupère toutes les annonces avec leurs données ACF
 */
export const fetchAllAnnonces = async (): Promise<NormalizedProperty[]> => {
  // 1. Récupérer la liste des annonces
  const annonces = await fetchAnnoncesList();
  
  // 2. Pour chaque annonce, récupérer les données ACF
  const annoncePromises = annonces.map(async (annonce) => {
    const acfData = await fetchAcfData(annonce.id);
    return normalizePropertyData(annonce, acfData);
  });
  
  // 3. Attendre que toutes les requêtes soient terminées
  const properties = await Promise.all(annoncePromises);
  
  // 4. Tri par date décroissante (plus récent d'abord)
  return properties.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Transforme les données brutes en un objet normalisé
 */
const normalizePropertyData = (
  annonce: WordPressAnnonce,
  acfData: AcfData | null
): NormalizedProperty => {
  // Fonction helper pour lire un champ dans l'ordre de préférence
  const getField = (fields: string[]): string => {
    if (acfData?.acf) {
      for (const field of fields) {
        if (acfData.acf[field]) return acfData.acf[field].toString();
      }
    }
    return "";
  };

  // Recherche de l'image principale
  let mainImage = DEFAULT_IMAGE;
  let allImages: string[] = [];
  
  // 1. Essayer d'abord les photos ACF
  if (acfData?.acf?.photos && acfData.acf.photos.length > 0) {
    const validPhotos = acfData.acf.photos
      .filter(photo => photo && photo.url)
      .map(photo => photo.url);
    
    if (validPhotos.length > 0) {
      mainImage = validPhotos[0];
      allImages = [...validPhotos];
    }
  }
  
  // 2. Sinon, utiliser l'image mise en avant WordPress si disponible
  if (allImages.length === 0 && annonce._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    mainImage = annonce._embedded["wp:featuredmedia"][0].source_url;
    allImages = [mainImage];
  }
  
  // Extraction de la description depuis l'extrait ou le contenu
  let description = "";
  if (annonce.excerpt?.rendered) {
    description = stripHtml(annonce.excerpt.rendered);
  } else if (annonce.content?.rendered) {
    description = stripHtml(annonce.content.rendered).substring(0, 150) + "...";
  }

  return {
    id: annonce.id,
    titre: annonce.title?.rendered || "Propriété sans titre",
    prix: getField(["prix", "prix_vente", "price"]) || "Prix sur demande",
    ville: getField(["ville", "localisation", "city"]) || "Non spécifié",
    surface: getField(["surface", "surf_hab", "area"]) || "NC",
    pieces: getField(["pieces", "piece", "rooms"]) || "NC",
    chambres: getField(["chambres", "nb_chambre", "bedrooms"]) || "NC",
    reference: getField(["reference", "mandat", "ref"]) || `REF-${annonce.id}`,
    image: mainImage,
    allImages: allImages.length > 0 ? allImages : [DEFAULT_IMAGE],
    description: description,
    date: annonce.date
  };
};

/**
 * Supprime les balises HTML d'une chaîne
 */
const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

