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
}

export type TransformedProperty = NormalizedProperty;
