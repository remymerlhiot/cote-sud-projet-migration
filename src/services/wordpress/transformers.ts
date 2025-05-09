// src/services/wordpress/transformers.ts

import { WordPressProperty, TransformedProperty } from "./types";

// Synonymes pour les champs courants (hors title, on le gère à part)
const SYNONYMS = {
  surface:    ["surf_hab", "surface", "area", "surface_totale", "superficie", "surface_habitable"],
  rooms:      ["piece", "rooms", "nombre_pieces", "nb_pieces", "pieces"],
  bedrooms:   ["nb_chambre", "bedrooms", "nombre_chambres", "nb_chambres", "chambres"],
  bathrooms:  ["nb_sdb", "nb_salle_deau", "nombre_sdb", "salles_de_bain", "sdb"],
  price:      ["prix_affiche", "prix", "price", "prix_vente"]
};

export const transformPropertyData = (wpProperty: WordPressProperty): TransformedProperty => {
  // --- 1) helper pour récupérer un champ via ses synonymes ---
  const getFieldValue = (fields: string[]): string => {
    // a) niveau racine
    for (const f of fields) {
      const v = (wpProperty as any)[f];
      if (v != null && v !== "") return String(v);
    }
    // b) dans ACF
    if (wpProperty.acf) {
      for (const f of fields) {
        const v = (wpProperty.acf as any)[f];
        if (v != null && v !== "") return String(v);
      }
    }
    // c) extraction dans le contenu HTML
    const html = wpProperty.content?.rendered || "";
    // prix
    if (fields.some(f => f.includes("prix"))) {
      const m = html.match(/Prix\s*[:\-]?\s*([\d\s.,]+)\s*€/i);
      if (m?.[1]) return `${m[1].trim()} €`;
    }
    // surface
    if (fields.some(f => f.includes("surf_hab"))) {
      const m = html.match(/Surface\s*[:\-]?\s*(\d+)\s*m²/i);
      if (m?.[1]) return m[1];
    }
    // pièces
    if (fields.some(f => f.includes("piece"))) {
      const m = html.match(/(\d+)\s*pièces?/i);
      if (m?.[1]) return m[1];
    }
    return "";
  };

  // --- 2) récupérer le titre correctement ---
  const title =
    wpProperty.title?.rendered?.trim() ||
    getFieldValue(["titre_fr"]) ||
    "Propriété";

  // --- 3) images ---
  const getAllImages = (): string[] => {
    const imgs: string[] = [];
    const src = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    if (src) imgs.push(src);
    return imgs.length
      ? imgs
      : ["/lovable-uploads/fallback.png"];
  };
  const featuredImage = getAllImages()[0];

  // --- 4) convertisseur simple en booléen ---
  const convertToBoolean = (s: string) =>
    !!s && ["1", "true", "oui"].includes(s.toLowerCase());

  // --- 5) récupération et formatage des champs principaux ---
  const priceRaw    = getFieldValue(SYNONYMS.price);
  const price       = priceRaw || "Prix sur demande";
  const priceNumber = parseInt(priceRaw.replace(/[^0-9]/g, "")) || 0;

  const areaRaw   = getFieldValue(SYNONYMS.surface);
  const area      = areaRaw ? `${areaRaw}m²` : "";

  const rooms    = getFieldValue(SYNONYMS.rooms);
  const bedrooms = getFieldValue(SYNONYMS.bedrooms);
  const bathrooms= getFieldValue(SYNONYMS.bathrooms);

  const reference     = getFieldValue(["reference", "mandat"]) || `REF ${wpProperty.id}`;
  const location      = getFieldValue(["ville", "localisation"]);
  const address       = getFieldValue(["adresse"]);
  const postalCode    = getFieldValue(["code_postal"]);
  const country       = getFieldValue(["pays"]) || "France";

  // description courte
  const htmlContent      = wpProperty.content?.rendered || "";
  const tempDiv          = document.createElement("div");
  tempDiv.innerHTML      = htmlContent;
  const plainText        = tempDiv.textContent || tempDiv.innerText || "";
  const descriptionShort = plainText.slice(0, 200) + (plainText.length > 200 ? "..." : "");

  // --- 6) log debug des valeurs extraites ---
  console.log("[WP TRANSFORM] ID:", wpProperty.id, {
    title, area, rooms, bedrooms, bathrooms, price, reference
  });

  // --- 7) création de l'objet final ---
  const transformed: TransformedProperty = {
    id:               wpProperty.id,
    title,
    location,
    ref:              reference,
    price,
    priceNumber,
    area,
    rooms,
    bedrooms,
    image:            featuredImage,
    allImages:        getAllImages(),
    date:             wpProperty.date || new Date().toISOString(),
    description:      descriptionShort,
    fullContent:      htmlContent,
    propertyType:     getFieldValue(["type", "famille", "idtype"]),
    constructionYear: getFieldValue(["annee_constr"]),
    hasBalcony:       convertToBoolean(getFieldValue(["balcon"])),
    hasElevator:      convertToBoolean(getFieldValue(["ascenseur"])),
    hasTerrasse:      convertToBoolean(getFieldValue(["terrasse"])),
    hasPool:          convertToBoolean(getFieldValue(["piscine"])),
    garageCount:      getFieldValue(["nb_garage"]),
    dpe:              getFieldValue(["dpe_lettre_consom_energ"]),
    postalCode,
    address,
    landArea:         getFieldValue(["surf_terrain"]),
    floorNumber:      getFieldValue(["num_etage"]),
    totalFloors:      getFieldValue(["nb_etage"]),
    bathrooms,
    toilets:          getFieldValue(["nb_wc"]),
    heatingType:      getFieldValue(["chauffage", "nature_chauffage"]),
    isNewConstruction: convertToBoolean(getFieldValue(["neuf"])),
    isPrestigious:     convertToBoolean(getFieldValue(["prestige"])) || priceNumber > 1_000_000,
    isFurnished:       convertToBoolean(getFieldValue(["meuble"])),
    isViager:          convertToBoolean(getFieldValue(["viager"])),
    dpeGes:            getFieldValue(["dpe_lettre_emissions_ges"]),
    dpeValue:          getFieldValue(["dpe_consom_energ"]),
    dpeGesValue:       getFieldValue(["dpe_emissions_ges"]),
    dpeDate:           getFieldValue(["dpe_date"]),
    country,
    negotiatorName:    getFieldValue(["nego_nom"]),
    negotiatorPhone:   getFieldValue(["nego_tel"]),
    negotiatorEmail:   getFieldValue(["nego_email"]),
    negotiatorPhoto:   getFieldValue(["photo_agent"]),
    negotiatorCity:    getFieldValue(["nego_ville"]),
    negotiatorPostalCode: getFieldValue(["nego_cp"]),
  };

  console.log("Transformed property:", transformed);
  return transformed;
};
