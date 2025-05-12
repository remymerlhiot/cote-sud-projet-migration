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
    photo?: Array<{
      url: string;
      alt?: string;
    }> | string;
    liste_photos?: Array<{
      url: string;
      alt?: string;
    }> | string;
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
    features?: any;
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
  hasBalcony?: boolean;
  hasTerrasse?: boolean;
  hasElevator?: boolean;
  hasPool?: boolean;
  garageCount?: string;
  constructionYear?: string;
  isFurnished?: boolean;
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
    const response = await fetch(`${API_BASE_URL}/acf/v3/posts/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données ACF: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Échec de la récupération des données ACF pour l'annonce #${id}:`, error);
    return null;
  }
};

/**
 * Récupère les médias joints à une annonce via l'endpoint WP Media
 */
const fetchAttachments = async (postId: number): Promise<string[]> => {
  try {
    const resp = await fetch(`${API_BASE_URL}/wp/v2/media?parent=${postId}&per_page=50`);
    if (!resp.ok) return [];
    const medias = await resp.json();
    return medias.map((m: any) => m.source_url);
  } catch (error) {
    console.error(`Échec de la récupération des médias pour l'annonce #${postId}:`, error);
    return [];
  }
};

/**
 * Récupère toutes les annonces avec leurs données ACF et médias
 */
export const fetchAllAnnonces = async (): Promise<NormalizedProperty[]> => {
  const annonces = await fetchAnnoncesList();
  const properties = await Promise.all(
    annonces.map(async (annonce) => {
      const acfData = await fetchAcfData(annonce.id);
      const normalized = normalizePropertyData(annonce, acfData);

      // Si aucune image ACF ou featured, on récupère tous les médias joints
      if (
        normalized.allImages.length === 1 &&
        normalized.allImages[0] === DEFAULT_IMAGE
      ) {
        const attached = await fetchAttachments(annonce.id);
        if (attached.length) {
          normalized.allImages = attached;
          normalized.image = attached[0];
        }
      }

      return normalized;
    })
  );

  // Tri par date décroissante (plus récent d'abord)
  return properties.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Transforme les données brutes en un objet normalisé
 */
const normalizePropertyData = (
  annonce: WordPressAnnonce,
  acfData: AcfData | null
): NormalizedProperty => {
  const getField = (fields: string[]): string => {
    if (acfData?.acf) {
      for (const field of fields) {
        if (acfData.acf[field]) return acfData.acf[field].toString();
      }
    }
    return "";
  };

  const hasBalcony = acfData?.acf?.features?.balcon === "oui" || false;
  const hasTerrasse = acfData?.acf?.features?.terrasse === "oui" || false;
  const hasElevator = acfData?.acf?.features?.ascenseur === "oui" || false;
  const hasPool = acfData?.acf?.features?.piscine === "oui" || false;
  const garageCount = acfData?.acf?.features?.garage || "0";
  const constructionYear = acfData?.acf?.features?.annee_construction || "";
  const isFurnished = acfData?.acf?.features?.meuble === "oui" || false;

  let allImages: string[] = [];

  if (acfData?.acf?.photo) {
    if (Array.isArray(acfData.acf.photo)) {
      allImages = acfData.acf.photo.filter(p => p && p.url).map(p => p.url);
    } else if (typeof acfData.acf.photo === "string" && acfData.acf.photo.trim()) {
      allImages = [acfData.acf.photo];
    }
  }

  if (!allImages.length && acfData?.acf?.liste_photos) {
    if (Array.isArray(acfData.acf.liste_photos)) {
      allImages = acfData.acf.liste_photos.filter(p => p && p.url).map(p => p.url);
    } else if (typeof acfData.acf.liste_photos === "string" && acfData.acf.liste_photos.trim()) {
      allImages = [acfData.acf.liste_photos];
    }
  }

  if (!allImages.length && acfData?.acf?.photos) {
    if (Array.isArray(acfData.acf.photos)) {
      const valid = acfData.acf.photos.filter(p => p && p.url).map(p => p.url);
      if (valid.length) allImages = valid;
    }
  }

  if (!allImages.length && annonce._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    allImages = [annonce._embedded["wp:featuredmedia"][0].source_url];
  }

  if (!allImages.length) {
    allImages = [DEFAULT_IMAGE];
  }

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
    image: allImages[0],
    allImages,
    description,
    date: annonce.date,
    hasBalcony,
    hasTerrasse,
    hasElevator,
    hasPool,
    garageCount,
    constructionYear,
    isFurnished
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
