
import { WordPressAnnonce, AcfData, NormalizedProperty } from "@/types";
import { DEFAULT_IMAGE } from "./config";

export const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const normalizePropertyData = (
  annonce: WordPressAnnonce,
  acfData: AcfData | null
): NormalizedProperty => {
  const getField = (fields: string[]): string => {
    if (acfData?.acf) {
      for (const f of fields) {
        const v = acfData.acf[f];
        if (v) return v.toString();
      }
    }
    return "";
  };

  // Caractéristiques
  const feats = acfData?.acf?.features || {};
  const hasBalcony = feats.balcon === "oui";
  const hasTerrasse = feats.terrasse === "oui";
  const hasElevator = feats.ascenseur === "oui";
  const hasPool = feats.piscine === "oui";
  const garageCount = feats.garage || "0";
  const constructionYear = feats.annee_construction || "";
  const isFurnished = feats.meuble === "oui";

  const isNewConstruction = acfData?.acf?.neuf === "1" || acfData?.acf?.neuf === "oui";
  const isPrestigious = acfData?.acf?.prestige === "1" || acfData?.acf?.prestige === "oui";
  const isViager = acfData?.acf?.viager === "1" || acfData?.acf?.viager === "oui";
  const bathrooms = getField(["nb_sdb", "bathrooms"]);

  // Images
  let allImages: string[] = [];
  const tryField = (field: any) => {
    if (Array.isArray(field)) {
      const urls = field.map((p: any) => p?.url).filter(Boolean);
      if (urls.length) return urls;
    } else if (typeof field === "string" && field.trim()) {
      return [field];
    }
    return [];
  };

  if (acfData?.acf.photo) {
    allImages = tryField(acfData.acf.photo);
  } else if (acfData?.acf.liste_photos) {
    allImages = tryField(acfData.acf.liste_photos);
  } else if (acfData?.acf.photos) {
    allImages = tryField(acfData.acf.photos);
  } else if (annonce._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    allImages = [annonce._embedded["wp:featuredmedia"][0].source_url];
  }

  if (!allImages.length) {
    allImages = [DEFAULT_IMAGE];
  }

  // Texte
  const description = annonce.excerpt?.rendered
    ? stripHtml(annonce.excerpt.rendered)
    : stripHtml(annonce.content?.rendered || "").slice(0, 150) + "...";

  const prixValue = getField(["prix", "prix_affiche", "price"]) || "Prix sur demande";
  const villeValue = getField(["ville", "localisation", "city"]) || "NC";
  const surfaceValue = getField(["surf_hab", "surface", "area"]) || "NC";
  const piecesValue = getField(["piece", "pieces", "rooms"]) || "NC";
  const chambresValue = getField(["nb_chambre", "chambres", "bedrooms"]) || "NC";
  const referenceValue = getField(["mandat", "reference", "ref"]) || `REF-${annonce.id}`;

  return {
    id: annonce.id,
    titre: annonce.title.rendered,
    title: annonce.title.rendered,
    prix: prixValue,
    price: prixValue,
    ville: villeValue,
    location: villeValue,
    surface: surfaceValue,
    area: surfaceValue,
    pieces: piecesValue,
    rooms: piecesValue,
    chambres: chambresValue,
    bedrooms: chambresValue,
    reference: referenceValue,
    ref: referenceValue,
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
    isFurnished,
    isNewConstruction,
    isPrestigious,
    isViager,
    propertyType: annonce.title.rendered.split(" ")[0] || "Propriété",
    bathrooms,
  };
};

// Export compatible
export { normalizePropertyData as transformPropertyData };
