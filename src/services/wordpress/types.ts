// Types for WordPress API responses
export interface WordPressProperty {
  id: number;
  date?: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  
  // Direct property fields to match API response structure
  // Ajout de tous les champs métier spécifiés
  mandat?: string;
  type_mandat?: string;
  operation?: string;
  viager?: string;
  famille?: string;
  type?: string;
  idtype?: string;
  nom_residence?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  localisation?: string;
  numero_voie?: string;
  pays?: string;
  prix?: string;
  prix_affiche?: string;
  date_dispo?: string;
  taxe_fonciere?: string;
  charges_mensuelles?: string;
  prestige?: string;
  neuf?: string;
  surf_hab?: string;
  surf_sejour?: string;
  surf_terrain?: string;
  piece?: string;
  nb_etage?: string;
  num_etage?: string;
  nb_chambre?: string;
  nb_sdb?: string;
  nb_salle_deau?: string;
  nb_wc?: string;
  chauffage?: string;
  nature_chauffage?: string;
  balcon?: string;
  meuble?: string;
  ascenseur?: string;
  nb_garage?: string;
  terrasse?: string;
  piscine?: string;
  annee_constr?: string;
  dpe_non_soumis?: string;
  dpe_consom_energ?: string;
  dpe_lettre_consom_energ?: string;
  dpe_emissions_ges?: string;
  dpe_lettre_emissions_ges?: string;
  dpe_date?: string;
  reference?: string;
  
  // Négociateur/Agent fields
  nego_nom?: string;
  nego_tel?: string;
  nego_email?: string;
  nego_cp?: string;
  nego_ville?: string;
  photo_agent?: string;
  
  // Keep the ACF object for backward compatibility
  acf?: {
    // Original fields (keeping for backward compatibility)
    location?: string;
    price?: string;
    area?: string;
    rooms?: string;
    bedrooms?: string;
    dpe?: string;
    
    // WordPress ACF field names - tous les champs métier
    mandat?: string;
    type_mandat?: string;
    operation?: string;
    viager?: string;
    famille?: string;
    type?: string;
    idtype?: string;
    nom_residence?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    localisation?: string;
    numero_voie?: string;
    pays?: string;
    prix?: string;
    prix_affiche?: string;
    date_dispo?: string;
    taxe_fonciere?: string;
    charges_mensuelles?: string;
    prestige?: string;
    neuf?: string;
    surf_hab?: string;
    surf_sejour?: string;
    surf_terrain?: string;
    piece?: string;
    nb_etage?: string;
    num_etage?: string;
    nb_chambre?: string;
    nb_sdb?: string;
    nb_salle_deau?: string;
    nb_wc?: string;
    chauffage?: string;
    nature_chauffage?: string;
    balcon?: string;
    meuble?: string;
    ascenseur?: string;
    nb_garage?: string;
    terrasse?: string;
    piscine?: string;
    annee_constr?: string;
    dpe_non_soumis?: string;
    dpe_consom_energ?: string;
    dpe_lettre_consom_energ?: string;
    dpe_emissions_ges?: string;
    dpe_lettre_emissions_ges?: string;
    dpe_date?: string;
    reference?: string;
    
    // Négociateur/Agent fields
    nego_nom?: string;
    nego_tel?: string;
    nego_email?: string;
    nego_cp?: string;
    nego_ville?: string;
    photo_agent?: string;
  };
  
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    "wp:attachment"?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_type?: string;
      mime_type?: string;
    }>;
  };
}

export interface WordPressAnnonce extends WordPressProperty {
  // Add any specific fields for the 'annonce' post type
  // The structure is largely the same as WordPressProperty
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

export interface WordPressPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  featured_media_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

// Interface for the custom endpoint response
export interface CustomWordPressPage {
  title: string;
  content: string;
  featured_image: string | null;
  elementor_data: string | null;
  media_list: string[];
}

// Definition for the transformed property - ajout des champs manquants
export interface TransformedProperty {
  id: number;
  title: string;
  location: string;
  ref: string;
  price: string;
  priceNumber: number;  // Numeric price for sorting and comparisons
  area: string;
  rooms: string;
  bedrooms: string;
  image: string;
  allImages: string[];  // All property images for gallery
  date: string;
  description: string;
  fullContent: string;
  propertyType: string;
  constructionYear: string;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasTerrasse: boolean;
  hasPool: boolean;
  garageCount: string;
  dpe: string;
  postalCode?: string;
  address?: string;
  bathrooms?: string;
  country?: string;
  landArea?: string;
  floorNumber?: string;
  totalFloors?: string;
  toilets?: string;
  heatingType?: string;
  isNewConstruction?: boolean;
  isPrestigious?: boolean;
  isFurnished?: boolean;
  isViager?: boolean;
  dpeGes?: string;
  dpeValue?: string;
  dpeGesValue?: string;
  dpeDate?: string;
  
  // Ajout des champs négociateur manquants
  negotiatorName?: string;
  negotiatorPhone?: string;
  negotiatorEmail?: string;
  negotiatorPhoto?: string;
  negotiatorCity?: string;
  negotiatorPostalCode?: string;
}
