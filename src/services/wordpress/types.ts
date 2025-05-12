
export interface WordPressAnnonce {
  id: number;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
  };
}

export interface AcfData {
  acf: {
    [key: string]: any;
    photo?: Array<{ url: string; alt?: string }> | string | null;
    liste_photos?: Array<{ url: string; alt?: string }> | string | null;
    photos?: Array<{ url: string; alt?: string }> | null;
    features?: any;
  };
}

export interface NormalizedProperty {
  id: number;
  titre: string;
  prix: string;
  ville: string;
  surface: string;
  pieces: string;
  chambres: string;
  reference: string;
  image: string;
  allImages: string[];
  description: string;
  date: string;
  hasBalcony?: boolean;
  hasTerrasse?: boolean;
  hasElevator?: boolean;
  hasPool?: boolean;
  garageCount?: string;
  constructionYear?: string;
  isFurnished?: boolean;
  // Extended properties for PropertyCard component
  propertyType?: string;
  title?: string;
  price?: string;
  area?: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  ref?: string;
  isNewConstruction?: boolean;
  isPrestigious?: boolean;
  isViager?: boolean;
  location?: string;
  priceNumber?: number;
  fullContent?: string;
  dpe?: string;
  postalCode?: string;
  address?: string;
  country?: string;
  landArea?: string;
  floorNumber?: string;
  totalFloors?: string;
  toilets?: string;
  heatingType?: string;
  dpeGes?: string;
  dpeValue?: string;
  dpeGesValue?: string;
  dpeDate?: string;
  negotiatorName?: string;
  negotiatorPhone?: string;
  negotiatorEmail?: string;
  negotiatorPhoto?: string;
  negotiatorCity?: string;
  negotiatorPostalCode?: string;
}

// Aliases to maintain compatibility
export type WordPressProperty = WordPressAnnonce;
export type TransformedProperty = NormalizedProperty;

// Page types 
export interface WordPressPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
  };
}

export interface CustomWordPressPage {
  title: string;
  content: string;
  featured_image: string | null;
  elementor_data: any | null;
  media_list: string[];
}

// Media type
export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_type: string;
  mime_type: string;
}
