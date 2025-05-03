
import { WordPressProperty, TransformedProperty } from "./types";

// Helper function to transform WordPress property data
export const transformPropertyData = (wpProperty: WordPressProperty): TransformedProperty => {
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"; // Fallback image
  
  // Log the full property data for debugging
  console.log("Transforming property:", wpProperty.id);
  
  // Helper function to get field value as string, ensuring we always return a string
  const getFieldValue = (fieldName: string, fallback: string = "Non spécifié"): string => {
    // Get value from root level property
    const rootValue = wpProperty[fieldName as keyof WordPressProperty];
    // Get value from ACF property
    const acfValue = wpProperty.acf?.[fieldName as keyof (typeof wpProperty.acf)];
    
    // Check for root level value
    if (rootValue !== undefined && rootValue !== null) {
      if (typeof rootValue === 'string') return rootValue;
      if (typeof rootValue === 'number') return String(rootValue);
      // Handle rendered property carefully with type checking
      if (typeof rootValue === 'object' && rootValue !== null) {
        // Check if the object has a 'rendered' property
        const renderedObj = rootValue as unknown as { rendered?: string };
        if (renderedObj.rendered) {
          return renderedObj.rendered;
        }
      }
    }
    
    // Check for ACF value
    if (acfValue !== undefined && acfValue !== null) {
      if (typeof acfValue === 'string') return acfValue;
      if (typeof acfValue === 'number') return String(acfValue);
      // Handle rendered property carefully with type checking
      if (typeof acfValue === 'object' && acfValue !== null) {
        // Check if the object has a 'rendered' property
        const renderedObj = acfValue as unknown as { rendered?: string };
        if (renderedObj.rendered) {
          return renderedObj.rendered;
        }
      }
    }
    
    return fallback;
  };
  
  // Extract fields with the helper function
  const location = getFieldValue('ville') || getFieldValue('localisation') || getFieldValue('location');
  const reference = getFieldValue('mandat') || getFieldValue('reference') || `REF ${wpProperty.id}`;
  
  // Handle price - try different possible field names
  const priceString = getFieldValue('prix_affiche') || getFieldValue('prix') || getFieldValue('price') || "Prix sur demande";
  const priceNumber = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  
  // Handle area/surface - try different possible field names and ensure it has "m²"
  let area = getFieldValue('surf_hab') || getFieldValue('area') || getFieldValue('surface');
  if (area !== "Non spécifié" && !area.includes("m²")) {
    area = `${area}m²`;
  }
  
  // Handle rooms and bedrooms - try different possible field names
  const rooms = getFieldValue('piece') || getFieldValue('rooms');
  const bedrooms = getFieldValue('nb_chambre') || getFieldValue('bedrooms');
  
  // DPE rating - get the energy consumption letter
  const dpe = getFieldValue('dpe_lettre_consom_energ') || getFieldValue('dpe');
  
  // Extract content without HTML tags for a clean description
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = wpProperty.content.rendered;
  const contentText = tempDiv.textContent || tempDiv.innerText || "";
  const shortDescription = contentText.substring(0, 150) + "...";
  
  // Additional property details using the helper function
  const propertyType = getFieldValue('type');
  const constructionYear = getFieldValue('annee_constr');
  const hasBalcony = getFieldValue('balcon') === "1";
  const hasElevator = getFieldValue('ascenseur') === "1";
  const hasTerrasse = getFieldValue('terrasse') === "1";
  const hasPool = getFieldValue('piscine') === "1";
  const garageCount = getFieldValue('nb_garage') || "0";
  
  // Handle title property carefully
  let title = "";
  if (typeof wpProperty.title === 'object' && wpProperty.title !== null && 'rendered' in wpProperty.title) {
    title = wpProperty.title.rendered;
  } else if (typeof wpProperty.title === 'string') {
    title = wpProperty.title;
  } else {
    title = "Propriété";
  }
  
  return {
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
    garageCount: garageCount
  };
};
