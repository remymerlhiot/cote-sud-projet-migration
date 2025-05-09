import { WordPressProperty, TransformedProperty } from "./types";

// Définition des synonymes pour les champs communs
const SYNONYMS = {
  surface: ["surf_hab", "surface", "area", "surface_totale", "superficie", "surface_habitable"],
  rooms: ["piece", "rooms", "nombre_pieces", "nb_pieces", "pieces"],
  bedrooms: ["nb_chambre", "bedrooms", "nombre_chambres", "nb_chambres", "chambres"],
  bathrooms: ["nb_sdb", "nb_salle_deau", "nombre_sdb", "salles_de_bain", "sdb"],
  price: ["prix_affiche", "prix", "price", "prix_vente"]
};

export const transformPropertyData = (wpProperty: WordPressProperty): TransformedProperty => {
  // Helper pour lire un champ via ses synonymes
  const getFieldValue = (fields: string[]): string => {
    // 1) au niveau racine
    for (const field of fields) {
      const v = (wpProperty as any)[field];
      if (v != null && v !== "") return String(v);
    }
    // 2) dans ACF
    if (wpProperty.acf) {
      for (const field of fields) {
        const v = (wpProperty.acf as any)[field];
        if (v != null && v !== "") return String(v);
      }
    }
    // 3) extraction dans le HTML du contenu
    const html = wpProperty.content?.rendered || "";
    if (fields.some(f => f.includes("prix"))) {
      const m = html.match(/Prix\s*[:\-]?\s*([\d\s.,]+)\s*€/i);
      if (m?.[1]) return `${m[1].trim()} €`;
    }
    if (fields.some(f => f.includes("surf_hab"))) {
      const m = html.match(/Surface\s*[:\-]?\s*(\d+)\s*m²/i);
      if (m?.[1]) return m[1];
    }
    if (fields.some(f => f.includes("piece"))) {
      const m = html.match(/(\d+)\s*pièces?/i);
      if (m?.[1]) return m[1];
    }
    return "";
  };

  const getAllImages = (): string[] => {
    const imgs: string[] = [];
    const src = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    if (src) imgs.push(src);
    return imgs.length ? imgs : ["/lovable-uploads/fallback.png"];
  };

  const convertToBoolean = (s: string) =>
    !!s && ["1", "true", "oui"].includes(s.toLowerCase());

  // Récupération et formatage des champs
  const priceRaw = getFieldValue(SYNONYMS.price);
  const priceString = priceRaw || "Prix sur demande";
  const priceNumber = parseInt(priceRaw.replace(/[^0-9]/g, "")) || 0;

  const areaRaw = getFieldValue(SYNONYMS.surface);
  const formattedArea = areaRaw ? `${areaRaw}m²` : "";

  const roomsRaw = getFieldValue(SYNONYMS.rooms);
  const bedroomsRaw = getFieldValue(SYNONYMS.bedrooms);
  const bathroomsRaw = getFieldValue(SYNONYMS.bathrooms);

  // Autres champs
  const reference = getFieldValue(["reference", "mandat"]) || `REF ${wpProperty.id}`;
  const title = getFieldValue(["titre_fr", "title"]) || "Propriété";
  const location = getFieldValue(["ville", "localisation"]);
  const address = getFieldValue(["adresse"]);
  const postalCode = getFieldValue(["code_postal"]);
  const country = getFieldValue(["pays"]) || "France";

  const html = wpProperty.content?.rendered || "";
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";
  const shortDescription = text.slice(0, 200) + (text.length > 200 ? "..." : "");

  const transformed: TransformedProperty = {
    id: wpProperty.id,
    title,
    location,
    ref: reference,
    price: priceString,
    priceNumber,
    area: formattedArea,
    rooms: roomsRaw,
    bedrooms: bedroomsRaw,
    image: getAllImages()[0],
    allImages: getAllImages(),
    date: wpProperty.date || new Date().toISOString(),
    description: shortDescription,
    fullContent: html,
    propertyType: getFieldValue(["type", "famille", "idtype"]),
    constructionYear: getFieldValue(["annee_constr"]),
    hasBalcony: convertToBoolean(getFieldValue(["balcon"])),
    hasElevator: convertToBoolean(getFieldValue(["ascenseur"])),
    hasTerrasse: convertToBoolean(getFieldValue(["terrasse"])),
    hasPool: convertToBoolean(getFieldValue(["piscine"])),
    garageCount: getFieldValue(["nb_garage"]),
    dpe: getFieldValue(["dpe_lettre_consom_energ"]),
    postalCode,
    address,
    landArea: getFieldValue(["surf_terrain"]),
    floorNumber: getFieldValue(["num_etage"]),
    totalFloors: getFieldValue(["nb_etage"]),
    bathrooms: bathroomsRaw,
    toilets: getFieldValue(["nb_wc"]),
    heatingType: getFieldValue(["chauffage", "nature_chauffage"]),
    isNewConstruction: convertToBoolean(getFieldValue(["neuf"])),
    isPrestigious: convertToBoolean(getFieldValue(["prestige"])) || priceNumber > 1_000_000,
    isFurnished: convertToBoolean(getFieldValue(["meuble"])),
    isViager: convertToBoolean(getFieldValue(["viager"])),
    dpeGes: getFieldValue(["dpe_lettre_emissions_ges"]),
    dpeValue: getFieldValue(["dpe_consom_energ"]),
    dpeGesValue: getFieldValue(["dpe_emissions_ges"]),
    dpeDate: getFieldValue(["dpe_date"]),
    country,
    negotiatorName: getFieldValue(["nego_nom"]),
    negotiatorPhone: getFieldValue(["nego_tel"]),
    negotiatorEmail: getFieldValue(["nego_email"]),
    negotiatorPhoto: getFieldValue(["photo_agent"]),
    negotiatorCity: getFieldValue(["nego_ville"]),
    negotiatorPostalCode: getFieldValue(["nego_cp"]),
  };

  console.log("Transformed property:", transformed);
  return transformed;
};
