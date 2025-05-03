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
  mandat?: string;
  ville?: string;
  localisation?: string;
  prix?: string;
  prix_affiche?: string;
  surf_hab?: string;
  piece?: string;
  nb_chambre?: string;
  dpe_lettre_consom_energ?: string;
  type_mandat?: string;
  operation?: string;
  famille?: string;
  type?: string;
  adresse?: string;
  code_postal?: string;
  pays?: string;
  prestige?: string;
  neuf?: string;
  surf_terrain?: string;
  nb_etage?: string;
  num_etage?: string;
  nb_sdb?: string;
  nb_salle_deau?: string;
  nb_wc?: string;
  chauffage?: string;
  balcon?: string;
  ascenseur?: string;
  nb_garage?: string;
  terrasse?: string;
  piscine?: string;
  annee_constr?: string;
  texte_fr?: string;
  reference?: string; // Unique reference field
  
  // Keep the ACF object for backward compatibility
  acf?: {
    // Original fields (keeping for backward compatibility)
    location?: string;
    price?: string;
    area?: string;
    rooms?: string;
    bedrooms?: string;
    dpe?: string;
    
    // WordPress ACF field names
    mandat?: string;
    ville?: string;
    localisation?: string;
    prix?: string;
    prix_affiche?: string;
    surf_hab?: string;
    piece?: string;
    nb_chambre?: string;
    dpe_lettre_consom_energ?: string;
    
    // Additional fields from the WordPress ACF list
    type_mandat?: string;
    operation?: string;
    famille?: string;
    type?: string;
    adresse?: string;
    code_postal?: string;
    pays?: string;
    prestige?: string;
    neuf?: string;
    surf_terrain?: string;
    nb_etage?: string;
    num_etage?: string;
    nb_sdb?: string;
    nb_salle_deau?: string;
    nb_wc?: string;
    chauffage?: string;
    balcon?: string;
    ascenseur?: string;
    nb_garage?: string;
    terrasse?: string;
    piscine?: string;
    annee_constr?: string;
    texte_fr?: string;
    reference?: string;
  };
  
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
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

// Definition for the transformed property
export interface TransformedProperty {
  id: number;
  title: string;
  location: string;
  ref: string;
  price: string;
  priceNumber: number;
  area: string;
  rooms: string;
  bedrooms: string;
  dpe: string;
  image: string;
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
}
