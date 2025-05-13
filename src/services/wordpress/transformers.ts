import { WordPressAnnonce, AcfData, NormalizedProperty } from "@/types";
import { extractImagesFromHtml } from "@/utils/extractImages";
import { DEFAULT_IMAGE } from "./config"; // Import DEFAULT_IMAGE

// Fonction pour nettoyer le HTML
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
  const isNewConstruction = feats.construction_neuve === "oui";
  const isPrestigious = acfData?.acf?.prestige === "1" || acfData?.acf?.prestige === "oui";
  const isViager = acfData?.acf?.viager === "1" || acfData?.acf?.viager === "oui";
  const bathrooms = getField(["nb_sdb", "bathrooms"]);

  // Images - Approche améliorée avec logs détaillés
  let allImages: string[] = [];
  let imageSource = "aucune source";

  // 1. Utiliser directement galerie_elementor si disponible
  if (
    annonce.galerie_elementor &&
    Array.isArray(annonce.galerie_elementor) &&
    annonce.galerie_elementor.length > 0
  ) {
    imageSource = "galerie_elementor";
    
    // Les URLs sont déjà sous forme de chaînes dans la réponse JSON
    allImages = annonce.galerie_elementor;
    
    console.log(`Property ${annonce.id}: Utilisation de ${imageSource} avec ${allImages.length} images`);
  }
  
  // 2. Si pas d'images dans galerie_elementor, essayer les médias attachés
  if (allImages.length === 0 && annonce._embedded?.["wp:attachment"]) {
    imageSource = "wp:attachment";
    const attachments = annonce._embedded["wp:attachment"];
    
    if (Array.isArray(attachments) && attachments.length > 0) {
      allImages = attachments.map(att => {
        if (typeof att === 'object' && att !== null) {
          return att.source_url || att.guid?.rendered || '';
        }
        return '';
      }).filter(Boolean);
      
      console.log(`Property ${annonce.id}: Utilisation de ${imageSource} avec ${allImages.length} images`);
    }
  }
  
  // 3. Essayer l'image mise en avant (featured) si toujours pas d'images
  if (allImages.length === 0 && annonce._embedded?.["wp:featuredmedia"]) {
    imageSource = "wp:featuredmedia";
    const featuredMedia = annonce._embedded["wp:featuredmedia"];
    
    if (Array.isArray(featuredMedia) && featuredMedia.length > 0) {
      const mediaItem = featuredMedia[0];
      if (mediaItem.source_url) {
        allImages.push(mediaItem.source_url);
        console.log(`Property ${annonce.id}: Utilisation de ${imageSource} avec 1 image`);
      }
    }
  }
  
  // 4. Essayer les champs ACF comme avant
  if (allImages.length === 0) {
    // Code existant pour essayer les champs ACF
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
      imageSource = "acf.photo";
      allImages = tryField(acfData.acf.photo);
    } else if (acfData?.acf.liste_photos) {
      imageSource = "acf.liste_photos";
      allImages = tryField(acfData.acf.liste_photos);
    } else if (acfData?.acf.photos) {
      imageSource = "acf.photos";
      allImages = tryField(acfData.acf.photos);
    }
    
    if (allImages.length > 0) {
      console.log(`Property ${annonce.id}: Utilisation de ${imageSource} avec ${allImages.length} images`);
    }
  }

  // 5. Essayer d'extraire du HTML en dernier recours
  if (allImages.length === 0) {
    imageSource = "extraction HTML";
    const extractedFromHtml = extractImagesFromHtml(annonce.content?.rendered || "");
    if (extractedFromHtml.length) {
      allImages = extractedFromHtml;
      console.log(`Property ${annonce.id}: Images extraites du HTML Elementor (${allImages.length})`);
    } else {
      imageSource = "image par défaut";
      allImages = [DEFAULT_IMAGE];
      console.log(`Property ${annonce.id}: Aucune image trouvée, utilisation de l'image par défaut`);
    }
  }
  
  // Filtrer les images pour éliminer les doublons et les URLs non valides
  allImages = [...new Set(allImages)].filter(url => 
    url && typeof url === 'string' && url.startsWith('http')
  );
  
  // Log final des images trouvées
  console.log(`Property ${annonce.id}: Total de ${allImages.length} images trouvées depuis ${imageSource}`);

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
    image: allImages.length > 0 ? allImages[0] : DEFAULT_IMAGE,
    allImages: allImages.length > 0 ? allImages : [DEFAULT_IMAGE],
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

export { normalizePropertyData as transformPropertyData };