
import { WordPressProperty, TransformedProperty } from "./types";

// Helper function to transform WordPress property data
export const transformPropertyData = (wpProperty: WordPressProperty): TransformedProperty => {
  // Get featured image or fallback
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"; // Fallback image
  
  // Log the complete property data for debugging
  console.log("Full WordPress Property Data:", wpProperty);
  console.log("Property ID:", wpProperty.id);
  console.log("Type field:", wpProperty.type);
  console.log("Famille field:", wpProperty.famille);
  
  // Helper function to get field value from multiple possible locations
  const getFieldValue = (fieldPaths: string[], fallback: string = "Non spécifié"): string => {
    // Try direct properties first (both at root level and in ACF)
    for (const path of fieldPaths) {
      // Check direct property access
      if (path in wpProperty && wpProperty[path as keyof WordPressProperty] !== null && 
          wpProperty[path as keyof WordPressProperty] !== undefined) {
        const value = wpProperty[path as keyof WordPressProperty];
        if (typeof value === 'string' && value.trim() !== '') return value;
        if (typeof value === 'number') return String(value);
      }
      
      // Check in ACF
      if (wpProperty.acf && path in wpProperty.acf) {
        const value = wpProperty.acf[path as keyof typeof wpProperty.acf];
        if (value && typeof value === 'string' && value.trim() !== '') return value;
        if (typeof value === 'number') return String(value);
      }
    }
    
    // Check for content in title field (rendered)
    if (fieldPaths.includes('title') && wpProperty.title?.rendered) {
      return wpProperty.title.rendered;
    }
    
    // Check in content.rendered for specific field patterns
    if (wpProperty.content?.rendered) {
      const contentText = wpProperty.content.rendered;
      
      // Look for price pattern in content
      if (fieldPaths.includes('prix') || fieldPaths.includes('prix_affiche')) {
        const priceMatches = contentText.match(/Prix\s*:\s*([\d\s]+\d+\s*(?:€|EUR)?)/i);
        if (priceMatches && priceMatches[1]) {
          return priceMatches[1].trim();
        }
      }
      
      // Look for surface pattern in content
      if (fieldPaths.includes('surf_hab') || fieldPaths.includes('surface')) {
        const surfaceMatches = contentText.match(/(\d+)\s*m²/i);
        if (surfaceMatches && surfaceMatches[1]) {
          return `${surfaceMatches[1]}m²`;
        }
      }
      
      // Look for rooms pattern in content
      if (fieldPaths.includes('piece')) {
        const roomsMatches = contentText.match(/T(\d+)/i) || contentText.match(/(\d+)\s*pièces?/i);
        if (roomsMatches && roomsMatches[1]) {
          return roomsMatches[1];
        }
      }
    }
    
    return fallback;
  };
  
  // Extract basic information
  // Try multiple possible field names for each property
  const propertyType = getFieldValue(['type', 'famille', 'propertyType']);
  const title = getFieldValue(['title', 'titre_fr'], propertyType || "Propriété");
  const location = getFieldValue(['ville', 'localisation', 'location']);
  const reference = getFieldValue(['mandat', 'reference'], `REF ${wpProperty.id}`);
  
  // Extract price information
  const priceString = getFieldValue(['prix_affiche', 'prix', 'price'], "Prix sur demande");
  const priceNumber = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  
  // Extract property details
  let area = getFieldValue(['surf_hab', 'area', 'surface']);
  if (area !== "Non spécifié" && !area.includes("m²")) {
    area = `${area}m²`;
  }
  
  const rooms = getFieldValue(['piece', 'rooms']);
  const bedrooms = getFieldValue(['nb_chambre', 'bedrooms']);
  const dpe = getFieldValue(['dpe_lettre_consom_energ', 'dpe']);
  
  // Extract content without HTML tags for a clean description
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = wpProperty.content.rendered;
  const contentText = tempDiv.textContent || tempDiv.innerText || "";
  const shortDescription = contentText.substring(0, 150) + "...";
  
  // Get property characteristics - convert string values to boolean
  const hasBalcony = getFieldValue(['balcon']) === "1" || getFieldValue(['balcon']).toLowerCase() === "true";
  const hasElevator = getFieldValue(['ascenseur']) === "1" || getFieldValue(['ascenseur']).toLowerCase() === "true";
  const hasTerrasse = getFieldValue(['terrasse']) === "1" || getFieldValue(['terrasse']).toLowerCase() === "true";
  const hasPool = getFieldValue(['piscine']) === "1" || getFieldValue(['piscine']).toLowerCase() === "true";
  const garageCount = getFieldValue(['nb_garage'], "0");
  
  // Additional fields
  const postalCode = getFieldValue(['code_postal']);
  const address = getFieldValue(['adresse']);
  const landArea = getFieldValue(['surf_terrain']);
  const floorNumber = getFieldValue(['num_etage']);
  const totalFloors = getFieldValue(['nb_etage']);
  const bathrooms = getFieldValue(['nb_sdb', 'nb_salle_deau']);
  const toilets = getFieldValue(['nb_wc']);
  const heatingType = getFieldValue(['chauffage']);
  const isNewConstruction = getFieldValue(['neuf']) === "1";
  const isPrestigious = getFieldValue(['prestige']) === "1";
  const country = getFieldValue(['pays'], "France");
  const constructionYear = getFieldValue(['annee_constr']);
  
  // Create the transformed property
  const transformedProperty: TransformedProperty = {
    id: wpProperty.id,
    title: title,
    location: location,
    ref: reference,
    price: priceString,
    priceNumber: priceNumber,
    area: area,
    rooms: rooms,
    bedrooms: bedrooms,
    dpe: dpe,
    image: featuredImage,
    date: wpProperty.date || new Date().toISOString(),
    description: shortDescription,
    fullContent: wpProperty.content.rendered || "",
    propertyType: propertyType,
    constructionYear: constructionYear,
    hasBalcony: hasBalcony,
    hasElevator: hasElevator,
    hasTerrasse: hasTerrasse,
    hasPool: hasPool,
    garageCount: garageCount,
    postalCode: postalCode,
    address: address,
    landArea: landArea,
    floorNumber: floorNumber,
    totalFloors: totalFloors,
    bathrooms: bathrooms,
    toilets: toilets,
    heatingType: heatingType,
    isNewConstruction: isNewConstruction,
    isPrestigious: isPrestigious,
    country: country
  };
  
  console.log("Transformed property:", transformedProperty);
  return transformedProperty;
};

