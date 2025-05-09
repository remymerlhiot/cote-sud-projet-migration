import { WordPressProperty, TransformedProperty } from "./types";

// Helper function to transform WordPress property data
export const transformPropertyData = (wpProperty: WordPressProperty): TransformedProperty => {
  // Log the complete property data for debugging
  console.log("Full WordPress Property Data:", wpProperty);
  
  // Get featured image or fallback
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"; // Fallback image
    
  // Helper function to get all images from the property (featured + gallery)
  const getAllImages = (): string[] => {
    const images: string[] = [];
    // Add featured image if available
    if (wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
      images.push(wpProperty._embedded["wp:featuredmedia"][0].source_url);
    }
    
    // Try to find gallery images in the content or other fields
    // This would need to be customized based on how gallery is stored
    
    // Return at least one image (fallback) if none are found
    if (images.length === 0) {
      images.push("/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png");
    }
    
    return images;
  };
  
  // Helper function to get field value with priority from direct properties
  // This checks both root level and ACF level and multiple possible field names
  const getFieldValue = (fields: string[], fallback: string = "Non spécifié"): string => {
    // First check at root level
    for (const field of fields) {
      if (field in wpProperty && wpProperty[field as keyof WordPressProperty]) {
        const value = wpProperty[field as keyof WordPressProperty];
        if (typeof value === 'string' && value.trim() !== '') return value;
        if (typeof value === 'number') return String(value);
      }
    }
    
    // Then check in ACF
    if (wpProperty.acf) {
      for (const field of fields) {
        if (field in wpProperty.acf && wpProperty.acf[field as keyof typeof wpProperty.acf]) {
          const value = wpProperty.acf[field as keyof typeof wpProperty.acf];
          if (typeof value === 'string' && value.trim() !== '') return value;
          if (typeof value === 'number') return String(value);
        }
      }
    }
    
    // Check if title.rendered exists for title field
    if (fields.includes('title') && wpProperty.title?.rendered) {
      return wpProperty.title.rendered;
    }
    
    // Check in content for specific patterns
    if (wpProperty.content?.rendered) {
      const contentText = wpProperty.content.rendered;
      
      // Extract price from content if needed
      if (fields.includes('prix') || fields.includes('prix_affiche')) {
        const priceMatches = contentText.match(/Prix\s*:\s*([\d\s.,]+)\s*€/i);
        if (priceMatches && priceMatches[1]) {
          return `${priceMatches[1].trim()} €`;
        }
      }
      
      // Extract surface from content if needed
      if (fields.includes('surf_hab')) {
        const surfaceMatches = contentText.match(/Surface\s*:\s*(\d+)\s*m²/i);
        if (surfaceMatches && surfaceMatches[1]) {
          return `${surfaceMatches[1]}m²`;
        }
      }
      
      // Extract rooms from content if needed
      if (fields.includes('piece')) {
        const roomsMatches = contentText.match(/(\d+)\s*pièces?/i);
        if (roomsMatches && roomsMatches[1]) {
          return roomsMatches[1];
        }
      }
    }
    
    return fallback;
  };
  
  // Helper to convert string value to boolean
  const convertToBoolean = (value: string | undefined): boolean => {
    if (!value) return false;
    if (value === "1" || value.toLowerCase() === "true" || value.toLowerCase() === "oui") return true;
    return false;
  };
  
  // Extract all property information using all possible field names
  const propertyType = getFieldValue(['type', 'famille', 'idtype']);
  const title = getFieldValue(['titre_fr', 'title'], "Propriété");
  const location = getFieldValue(['ville', 'localisation']);
  const reference = getFieldValue(['reference', 'mandat'], `REF ${wpProperty.id}`);
  const address = getFieldValue(['adresse']);
  const postalCode = getFieldValue(['code_postal']);
  const country = getFieldValue(['pays'], "France");
  
  // Extract price information with all possible fields
  const priceString = getFieldValue(['prix_affiche', 'prix', 'price'], "Prix sur demande");
  // Parse numeric price for sorting
  const priceNumber = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  
  // Extract property details with all possible fields
  const area = getFieldValue(['surf_hab', 'area', 'surface']);
  const formattedArea = area !== "Non spécifié" && !area.includes("m²") ? `${area}m²` : area;
  
  const rooms = getFieldValue(['piece', 'rooms']);
  const bedrooms = getFieldValue(['nb_chambre', 'bedrooms']);
  const bathrooms = getFieldValue(['nb_sdb', 'nb_salle_deau']);
  const toilets = getFieldValue(['nb_wc']);
  const landArea = getFieldValue(['surf_terrain']);
  const floorNumber = getFieldValue(['num_etage']);
  const totalFloors = getFieldValue(['nb_etage']);
  const constructionYear = getFieldValue(['annee_constr']);
  const heatingType = getFieldValue(['chauffage', 'nature_chauffage']);
  
  // Get DPE information
  const dpe = getFieldValue(['dpe_lettre_consom_energ', 'dpe']);
  const dpeValue = getFieldValue(['dpe_consom_energ']);
  const dpeGes = getFieldValue(['dpe_lettre_emissions_ges']);
  const dpeGesValue = getFieldValue(['dpe_emissions_ges']);
  const dpeDate = getFieldValue(['dpe_date']);
  
  // Extract content without HTML tags for a clean description
  const contentText = wpProperty.content?.rendered || "";
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = contentText;
  const cleanedContent = tempDiv.textContent || tempDiv.innerText || "";
  const shortDescription = cleanedContent.substring(0, 200) + (cleanedContent.length > 200 ? "..." : "");
  
  // Get property characteristics - convert string values to boolean
  const hasBalcony = convertToBoolean(getFieldValue(['balcon']));
  const hasElevator = convertToBoolean(getFieldValue(['ascenseur']));
  const hasTerrasse = convertToBoolean(getFieldValue(['terrasse']));
  const hasPool = convertToBoolean(getFieldValue(['piscine']));
  const garageCount = getFieldValue(['nb_garage'], "0");
  
  // Additional property status flags
  const isNewConstruction = convertToBoolean(getFieldValue(['neuf']));
  const isPrestigious = convertToBoolean(getFieldValue(['prestige'])) || priceNumber > 1000000;
  const isViager = convertToBoolean(getFieldValue(['viager']));
  const isFurnished = convertToBoolean(getFieldValue(['meuble']));
  
  // Get negotiator information
  const negotiatorName = getFieldValue(['nego_nom']);
  const negotiatorPhone = getFieldValue(['nego_tel']);
  const negotiatorEmail = getFieldValue(['nego_email']);
  const negotiatorPhoto = getFieldValue(['photo_agent']);
  const negotiatorCity = getFieldValue(['nego_ville']);
  const negotiatorPostalCode = getFieldValue(['nego_cp']);
  
  // Create the transformed property
  const transformedProperty: TransformedProperty = {
    id: wpProperty.id,
    title: title,
    location: location,
    ref: reference,
    price: priceString,
    priceNumber: priceNumber,
    area: formattedArea,
    rooms: rooms,
    bedrooms: bedrooms,
    image: featuredImage,
    allImages: getAllImages(),
    date: wpProperty.date || new Date().toISOString(),
    description: shortDescription,
    fullContent: wpProperty.content?.rendered || "",
    propertyType: propertyType,
    constructionYear: constructionYear,
    hasBalcony: hasBalcony,
    hasElevator: hasElevator,
    hasTerrasse: hasTerrasse,
    hasPool: hasPool,
    garageCount: garageCount,
    dpe: dpe,
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
    isFurnished: isFurnished,
    isViager: isViager,
    dpeGes: dpeGes,
    dpeValue: dpeValue,
    dpeGesValue: dpeGesValue,
    dpeDate: dpeDate,
    country: country,
    
    // Ajout des informations du négociateur
    negotiatorName: negotiatorName,
    negotiatorPhone: negotiatorPhone,
    negotiatorEmail: negotiatorEmail,
    negotiatorPhoto: negotiatorPhoto,
    negotiatorCity: negotiatorCity,
    negotiatorPostalCode: negotiatorPostalCode
  };
  
  console.log("Transformed property:", transformedProperty);
  return transformedProperty;
};
