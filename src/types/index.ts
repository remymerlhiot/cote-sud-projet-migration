
// Types pour les propriétés immobilières
export interface WordPressAnnonce {
  id: number;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
    "wp:attachment"?: Array<{ source_url: string; alt_text?: string }>;
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
}

// Pour les propriétés WordPress
export interface WordPressProperty {
  id: number;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
    "wp:attachment"?: Array<{ source_url: string; alt_text?: string }>;
  };
}

export type TransformedProperty = NormalizedProperty;

// Pour les pages WordPress
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

// Pour les médias WordPress
export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_type: string;
  mime_type: string;
}
