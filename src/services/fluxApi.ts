import { toast } from "@/components/ui/sonner";
import { WordPressAnnonce, AcfData, NormalizedProperty } from "../types";
import { normalizePropertyData } from "../transformers";
import { API_BASE_URL, DEFAULT_IMAGE } from "../config";

// 1. Liste WP REST
export const fetchAnnoncesList = async (): Promise<WordPressAnnonce[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/wp/v2/annonce?_embed&per_page=40`);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  } catch (e) {
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
    const res = await fetch(`${API_BASE_URL}/wp/v2/media?parent=${postId}&per_page=50`);
    if (!res.ok) return [];
    const medias = await res.json();
    return medias.map((m: any) => m.source_url);
  } catch {
    return [];
  }
};

// 4. Tout récupérer et normaliser
export const fetchAllAnnonces = async (): Promise<NormalizedProperty[]> => {
  const annonces = await fetchAnnoncesList();
  const props = await Promise.all(
    annonces.map(async annonce => {
      const acf = await fetchAcfData(annonce.id);
      let np = normalizePropertyData(annonce, acf);
      // fallback attachments
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
  return props.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
