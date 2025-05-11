
import { WordPressProperty, TransformedProperty } from "./types";

// Map de synonymes pour lire dans wpProperty ou dans wpProperty.acf
const SYNONYMS = {
  price:      ["prix_affiche", "prix", "price", "prix_vente"],
  area:       ["surf_hab", "surface", "area", "superficie"],
  rooms:      ["piece", "rooms", "nombre_pieces", "nb_pieces"],
  bedrooms:   ["nb_chambre", "bedrooms", "nombre_chambres", "nb_chambres"],
  bathrooms:  ["nb_sdb", "salles_de_bain", "nb_salle_deau"]
};

function readField(property: WordPressProperty, keys: string[]): string {
  for (const key of keys) {
    const v = (property as any)[key];
    if (v != null && v !== "") return String(v);
  }
  if (property.acf) {
    for (const key of keys) {
      const v = (property.acf as any)[key];
      if (v != null && v !== "") return String(v);
    }
  }
  return "";
}

export const transformPropertyData = (
  property: WordPressProperty
): TransformedProperty => {
  // Fallback sur image
  const fallbackImage = "/lovable-uploads/fallback.png";

  // --- Champs principaux ---
  const priceRaw    = readField(property, SYNONYMS.price);
  const price       = priceRaw ? `${priceRaw} €` : "Prix sur demande";
  const priceNumber = parseInt(priceRaw.replace(/[^0-9]/g, ""), 10) || 0;

  const areaRaw  = readField(property, SYNONYMS.area);
  const area     = areaRaw ? `${areaRaw}m²` : "";

  const rooms     = readField(property, SYNONYMS.rooms);
  const bedrooms  = readField(property, SYNONYMS.bedrooms);
  const bathrooms = readField(property, SYNONYMS.bathrooms);

  const reference  = readField(property, ["reference", "mandat"]) || `REF ${property.id}`;
  const title      = property.title?.rendered?.trim() || "Propriété";
  const location   = readField(property, ["ville", "localisation"]);
  const address    = readField(property, ["adresse"]);
  const postalCode = readField(property, ["code_postal"]);
  const country    = readField(property, ["pays"]) || "France";

  // --- Images ---
  // 1) Featured media
  const featuredImage =
    property._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    fallbackImage;

  // 2) Tous les attachements (médias WordPress)
  const attachmentImages: string[] =
    property._embedded?.["wp:attachment"]?.map((m: any) => m.source_url).filter(Boolean) ||
    [];

  // 3) On fusionne et on enlève les doublons
  const allImages = Array.from(new Set([
    featuredImage,
    ...attachmentImages
  ])).filter(url => url !== fallbackImage || allImages.length === 0);

  console.log(`transformPropertyData: property #${property.id} has ${
    allImages.length} images total (${
    attachmentImages.length} attachments + featured)`);

  // --- Booléens helpers ---
  const toBool = (v: string) =>
    ["1", "true", "oui"].includes(v.toLowerCase());

  // --- Caractéristiques diverses ---
  const hasBalcony     = toBool(readField(property, ["balcon"]));
  const hasTerrasse    = toBool(readField(property, ["terrasse"]));
  const hasPool        = toBool(readField(property, ["piscine"]));
  const hasElevator    = toBool(readField(property, ["ascenseur"]));
  const garageCount    = readField(property, ["nb_garage"]);

  // DPE / GES
  const dpe         = readField(property, ["dpe_lettre_consom_energ"]);
  const dpeValue    = readField(property, ["dpe_consom_energ"]);
  const dpeGes      = readField(property, ["dpe_lettre_emissions_ges"]);
  const dpeGesValue = readField(property, ["dpe_emissions_ges"]);
  const dpeDate     = readField(property, ["dpe_date"]);

  // Construction / négociateur
  const constructionYear   = readField(property, ["annee_constr"]);
  const negotiatorName     = readField(property, ["nego_nom"]);
  const negotiatorPhone    = readField(property, ["nego_tel"]);
  const negotiatorEmail    = readField(property, ["nego_email"]);
  const negotiatorCity     = readField(property, ["nego_ville"]);
  const negotiatorPostal   = readField(property, ["nego_cp"]);
  const negotiatorPhoto    = readField(property, ["photo_agent"]);

  return {
    id: property.id,
    title,
    location,
    ref: reference,
    price,
    priceNumber,
    area,
    rooms,
    bedrooms,
    bathrooms,
    image: featuredImage,
    allImages,
    date: property.date || new Date().toISOString(),
    description: property.excerpt?.rendered || "",
    fullContent: property.content?.rendered || "",
    propertyType: readField(property, ["type", "famille", "idtype"]),
    address,
    postalCode,
    country,
    constructionYear,
    hasBalcony,
    hasTerrasse,
    hasPool,
    hasElevator,
    garageCount,
    dpe,
    dpeValue,
    dpeGes,
    dpeGesValue,
    dpeDate,
    toilets: readField(property, ["nb_wc"]),
    heatingType: readField(property, ["chauffage", "nature_chauffage"]),
    isNewConstruction: toBool(readField(property, ["neuf"])),
    isPrestigious:     toBool(readField(property, ["prestige"])) || priceNumber > 1_000_000,
    isFurnished:       toBool(readField(property, ["meuble"])),
    isViager:          toBool(readField(property, ["viager"])),
    negotiatorName,
    negotiatorPhone,
    negotiatorEmail,
    negotiatorPhoto,
    negotiatorCity,
    negotiatorPostalCode: negotiatorPostal,
    landArea: readField(property, ["surf_terrain"]),
    floorNumber: readField(property, ["num_etage"]),
    totalFloors: readField(property, ["nb_etage"])
  };
};
