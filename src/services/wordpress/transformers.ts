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
 * Essaie de lire v dans wpProperty[field] puis dans wpProperty.acf[field]
 */
function readField(
  wpProperty: WordPressProperty,
  keys: string[]
): string {
  for (const key of keys) {
    const val = (wpProperty as any)[key];
    if (val != null && val !== "") return String(val);
  }
  if (wpProperty.acf) {
    for (const key of keys) {
      const val = (wpProperty.acf as any)[key];
      if (val != null && val !== "") return String(val);
    }
  }
  return "";
}

/**
 * Transforme une annonce WP en TransformedProperty
 */
export const transformPropertyData = (
  wpProperty: WordPressProperty
): TransformedProperty => {
  // Lecture des champs principaux
  const priceRaw    = readField(wpProperty, SYNONYMS.price);
  const price       = priceRaw ? `${priceRaw} €` : "Prix sur demande";
  const priceNumber = parseInt(priceRaw.replace(/[^0-9]/g, ""), 10) || 0;

  const areaRaw = readField(wpProperty, SYNONYMS.area);
  const area    = areaRaw ? `${areaRaw}m²` : "";

  const rooms    = readField(wpProperty, SYNONYMS.rooms);
  const bedrooms = readField(wpProperty, SYNONYMS.bedrooms);
  const bathrooms= readField(wpProperty, SYNONYMS.bathrooms);

  // Métadonnées
  const reference  = readField(wpProperty, ["reference", "mandat"]) || `REF ${wpProperty.id}`;
  const title      = wpProperty.title?.rendered?.trim() || "Propriété";
  const location   = readField(wpProperty, ["ville", "localisation"]);
  const address    = readField(wpProperty, ["adresse"]);
  const postalCode = readField(wpProperty, ["code_postal"]);
  const country    = readField(wpProperty, ["pays"]) || "France";

  // Images
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    || "/lovable-uploads/fallback.png";
  const allImages = wpProperty._embedded?.["wp:featuredmedia"]?.map(m => m.source_url)
    || [featuredImage];

  // Conversion booléen
  const toBool = (v: string) => ["1", "true", "oui"].includes(v.toLowerCase());

  // Caractéristiques
  const hasBalcony  = toBool(readField(wpProperty, ["balcon"]));
  const hasTerrace = toBool(readField(wpProperty, ["terrasse"]));
  const hasPool     = toBool(readField(wpProperty, ["piscine"]));
  const hasElevator = toBool(readField(wpProperty, ["ascenseur"]));
  const garageCount = readField(wpProperty, ["nb_garage"]);

  // DPE/GES
  const dpe         = readField(wpProperty, ["dpe_lettre_consom_energ"]);
  const dpeValue    = readField(wpProperty, ["dpe_consom_energ"]);
  const dpeGes      = readField(wpProperty, ["dpe_lettre_emissions_ges"]);
  const dpeGesValue = readField(wpProperty, ["dpe_emissions_ges"]);
  const dpeDate     = readField(wpProperty, ["dpe_date"]);

  // Construction
  const constructionYear = readField(wpProperty, ["annee_constr"]);

  // Négociateur
  const negotiatorName      = readField(wpProperty, ["nego_nom"]);
  const negotiatorPhone     = readField(wpProperty, ["nego_tel"]);
  const negotiatorEmail     = readField(wpProperty, ["nego_email"]);
  const negotiatorCity      = readField(wpProperty, ["nego_ville"]);
  const negotiatorPostalCode= readField(wpProperty, ["nego_cp"]);
  const negotiatorPhoto     = readField(wpProperty, ["photo_agent"]);

  return {
    id: wpProperty.id,
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
    date: wpProperty.date || new Date().toISOString(),
    description: wpProperty.excerpt?.rendered || "",
    fullContent: wpProperty.content?.rendered || "",
    propertyType: readField(wpProperty, ["type", "famille", "idtype"]),
    address,
    postalCode,
    country,
    constructionYear,
    hasBalcony,
    hasTerrace,
    hasPool,
    hasElevator,
    garageCount,
    dpe,
    dpeValue,
    dpeGes,
    dpeGesValue,
    dpeDate,
    toilets: readField(wpProperty, ["nb_wc"]),
    heatingType: readField(wpProperty, ["chauffage", "nature_chauffage"]),
    isNewConstruction: toBool(readField(wpProperty, ["neuf"])),
    isPrestigious:     toBool(readField(wpProperty, ["prestige"])) || priceNumber > 1_000_000,
    isFurnished:       toBool(readField(wpProperty, ["meuble"])),
    isViager:          toBool(readField(wpProperty, ["viager"])),
    negotiatorName,
    negotiatorPhone,
    negotiatorEmail,
    negotiatorPhoto,
    negotiatorCity,
    negotiatorPostalCode,
    landArea: readField(wpProperty, ["surf_terrain"]),
    floorNumber: readField(wpProperty, ["num_etage"]),
    totalFloors: readField(wpProperty, ["nb_etage"]),
  };
};
