/**
 * Extrait toutes les URLs d'images d'une chaîne HTML
 */
export const extractImagesFromHtml = (html: string): string[] => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const dataImgRegex = /data-image="([^"]+)"/g;
  const urlRegex = /url\(['"]?([^'"]+)['"]?\)/g;
  
  const images: string[] = [];
  
  // Extraire les balises <img>
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1] && !match[1].includes('data:image')) {
      images.push(match[1]);
    }
  }
  
  // Extraire les attributs data-image
  while ((match = dataImgRegex.exec(html)) !== null) {
    if (match[1]) {
      images.push(match[1]);
    }
  }
  
  // Extraire les urls des styles CSS
  while ((match = urlRegex.exec(html)) !== null) {
    if (match[1] && !match[1].includes('data:image')) {
      images.push(match[1]);
    }
  }
  
  // Éliminer les doublons et filtrer les URLs non-valides
  return [...new Set(images)]
    .filter(url => url.startsWith('http') && 
      (url.endsWith('.jpg') || url.endsWith('.jpeg') || 
       url.endsWith('.png') || url.endsWith('.webp') || 
       url.endsWith('.gif')));
};