// Au début du fichier, ajoute l'import si ce n'est pas déjà fait
import { extractImagesFromHtml } from "@/utils/extractImages";

// Dans la fonction normalizePropertyData
export const normalizePropertyData = (
  annonce: WordPressAnnonce,
  acfData: AcfData | null
): NormalizedProperty => {
  // ... code existant ...

  // Images - Approche améliorée pour utiliser directement galerie_elementor
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
  
  // 4. Si toujours pas d'images, essayer d'extraire du HTML
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
  
  console.log(`Property ${annonce.id}: Total de ${allImages.length} images trouvées depuis ${imageSource}`);

  // ... reste du code ...

  return {
    // ... autres propriétés ...
    image: allImages.length > 0 ? allImages[0] : DEFAULT_IMAGE,
    allImages: allImages.length > 0 ? allImages : [DEFAULT_IMAGE],
    // ... autres propriétés ...
  };
};
