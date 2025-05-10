
import { WordPressProperty, TransformedProperty } from "./types";

// Map de synonymes pour lire dans wpProperty ou dans wpProperty.acf
const SYNONYMS = {
  price:      ["prix_affiche", "prix", "price", "prix_vente"],
  area:       ["surf_hab", "surface", "area", "superficie"],
  rooms:      ["piece", "rooms", "nombre_pieces", "nb_pieces"],
  bedrooms:   ["nb_chambre", "bedrooms", "nombre_chambres", "nb_chambres"],
  bathrooms:  ["nb_sdb", "salles_de_bain", "nb_salle_deau"]
};

/**
 * Essaie de lire v dans property[field] puis dans property.acf[field]
 */
function readField(
  property: WordPressProperty,
  keys: string[]
): string {
  for (const key of keys) {
    const val = (property as any)[key];
    if (val != null && val !== "") return String(val);
  }
  if (property.acf) {
    for (const key of keys) {
      const val = (property.acf as any)[key];
      if (val != null && val !== "") return String(val);
    }
  }
  return "";
}

/**
 * Transforme une annonce WP en TransformedProperty
 */
export const transformPropertyData = (
  property: WordPressProperty
): TransformedProperty => {
  // Lecture des champs principaux
  const priceRaw    = readField(property, SYNONYMS.price);
  const price       = priceRaw ? `${priceRaw} €` : "Prix sur demande";
  const priceNumber = parseInt(priceRaw.replace(/[^0-9]/g, ""), 10) || 0;

  const areaRaw = readField(property, SYNONYMS.area);
  const area    = areaRaw ? `${areaRaw}m²` : "";

  const rooms    = readField(property, SYNONYMS.rooms);
  const bedrooms = readField(property, SYNONYMS.bedrooms);
  const bathrooms= readField(property, SYNONYMS.bathrooms);

  // Métadonnées
  const reference  = readField(property, ["reference", "mandat"]) || `REF ${property.id}`;
  const title      = property.title?.rendered?.trim() || "Propriété";
  const location   = readField(property, ["ville", "localisation"]);
  const address    = readField(property, ["adresse"]);
  const postalCode = readField(property, ["code_postal"]);
  const country    = readField(property, ["pays"]) || "France";

  // Images
  const featuredImage = property._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    || "/lovable-uploads/fallback.png";
  const allImages = property._embedded?.["wp:featuredmedia"]?.map(m => m.source_url)
    || [featuredImage];

  // Conversion booléen
  const toBool = (v: string) => ["1", "true", "oui"].includes(v.toLowerCase());

  // Caractéristiques
  const hasBalcony  = toBool(readField(property, ["balcon"]));
  const hasTerrace = toBool(readField(property, ["terrasse"]));
  const hasPool     = toBool(readField(property, ["piscine"]));
  const hasElevator = toBool(readField(property, ["ascenseur"]));
  const garageCount = readField(property, ["nb_garage"]);

  // DPE/GES
  const dpe         = readField(property, ["dpe_lettre_consom_energ"]);
  const dpeValue    = readField(property, ["dpe_consom_energ"]);
  const dpeGes      = readField(property, ["dpe_lettre_emissions_ges"]);
  const dpeGesValue = readField(property, ["dpe_emissions_ges"]);
  const dpeDate     = readField(property, ["dpe_date"]);

  // Construction
  const constructionYear = readField(property, ["annee_constr"]);

  // Négociateur
  const negotiatorName      = readField(property, ["nego_nom"]);
  const negotiatorPhone     = readField(property, ["nego_tel"]);
  const negotiatorEmail     = readField(property, ["nego_email"]);
  const negotiatorCity      = readField(property, ["nego_ville"]);
  const negotiatorPostalCode= readField(property, ["nego_cp"]);
  const negotiatorPhoto     = readField(property, ["photo_agent"]);

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
    hasTerrace: hasTerrace,
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
    negotiatorPostalCode,
    landArea: readField(property, ["surf_terrain"]),
    floorNumber: readField(property, ["num_etage"]),
    totalFloors: readField(property, ["nb_etage"]),
  };
};
