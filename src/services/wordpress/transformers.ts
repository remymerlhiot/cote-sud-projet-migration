// src/services/wordpress/transformers.ts

import { WordPressProperty, TransformedProperty } from "./types";

/**
 * Transforme un objet WordPressProperty en TransformedProperty
 * en lisant directement les champs ACF présents sous wpProperty.acf
 */
export const transformPropertyData = (
  wpProperty: WordPressProperty
): TransformedProperty => {
  const acf = wpProperty.acf || {};

  // Lecture directe des ACF (vérifie bien que ces clés correspondent à tes champs)
  const area       = acf.surf_hab              ? `${acf.surf_hab}m²`  : "";
  const rooms      = acf.piece                  ? String(acf.piece)    : "";
  const bedrooms   = acf.nb_chambre             ? String(acf.nb_chambre): "";
  const bathrooms  = acf.nb_sdb                 ? String(acf.nb_sdb)   : "";
  const priceRaw   = acf.prix                   ? String(acf.prix)     : "";
  const price      = priceRaw                   ? `${priceRaw} €`      : "Prix sur demande";
  const priceNumber= parseInt(priceRaw, 10) || 0;

  // Métadonnées de base
  const reference  = acf.mandat                  ? String(acf.mandat)   : `REF ${wpProperty.id}`;
  const title      = wpProperty.title?.rendered  ? wpProperty.title.rendered.trim() : "Propriété";
  const location   = acf.localisation            ? String(acf.localisation) : "";
  const address    = acf.adresse                 ? String(acf.adresse) : "";
  const postalCode = acf.code_postal             ? String(acf.code_postal) : "";
  const country    = acf.pays                    ? String(acf.pays)     : "France";

  // Images
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    || "/lovable-uploads/fallback.png";
  const allImages = wpProperty._embedded?.["wp:gallery"]?.map((m: any) => m.source_url)
    || [featuredImage];

  // Conversion simple en booléen
  const toBool = (v: any) => v === "1" || v === 1 || v === true || v === "oui";

  // Caractéristiques
  const hasBalcony  = toBool(acf.balcon);
  const hasTerrace = toBool(acf.terrasse);
  const hasPool     = toBool(acf.piscine);
  const hasElevator = toBool(acf.ascenseur);
  const garageCount = acf.nb_garage ? String(acf.nb_garage) : "";

  // DPE/GES
  const dpe          = acf.dpe_lettre_consom_energ  || "";
  const dpeValue     = acf.dpe_consom_energ          ? String(acf.dpe_consom_energ) : "";
  const dpeGes       = acf.dpe_lettre_emissions_ges  || "";
  const dpeGesValue  = acf.dpe_emissions_ges         ? String(acf.dpe_emissions_ges) : "";
  const dpeDate      = acf.dpe_date                  || "";

  // Construction / année
  const constructionYear = acf.annee_constr ? String(acf.annee_constr) : "";

  // Négociateur
  const negotiatorName  = acf.nego_nom   || "";
  const negotiatorPhone = acf.nego_tel   || "";
  const negotiatorEmail = acf.nego_email || "";
  const negotiatorCity  = acf.nego_ville || "";
  const negotiatorPhoto = acf.photo_agent|| "";

  return {
    id:               wpProperty.id,
    title,
    location,
    ref:              reference,
    price,
    priceNumber,
    area,
    rooms,
    bedrooms,
    bathrooms,
    image:            featuredImage,
    allImages,
    date:             wpProperty.date || new Date().toISOString(),
    description:      wpProperty.excerpt?.rendered || "",
    fullContent:      wpProperty.content?.rendered || "",
    propertyType:     acf.type      || "",
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
    toilets:          acf.nb_wc ? String(acf.nb_wc) : "",
    heatingType:      acf.chauffage || "",
    isNewConstruction: toBool(acf.neuf),
    isPrestigious:     toBool(acf.prestige) || priceNumber > 1_000_000,
    isFurnished:       toBool(acf.meuble),
    isViager:          toBool(acf.viager),
    negotiatorName,
    negotiatorPhone,
    negotiatorEmail,
    negotiatorPhoto,
    negotiatorCity,
    negotiatorPostalCode: acf.nego_cp || "",
    landArea:         acf.surf_terrain ? String(acf.surf_terrain) : "",
    floorNumber:      acf.num_etage ? String(acf.num_etage) : "",
    totalFloors:      acf.nb_etage ? String(acf.nb_etage) : "",
  };
};
