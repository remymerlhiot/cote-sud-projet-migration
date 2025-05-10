
// src/services/wordpressApi.ts

// On ré-exporte uniquement ce que la couche WordPress propose réellement :

export * from "./wordpress/types";
export * from "./wordpress/config";
export * from "./wordpress/transformers";
export * from "./wordpress/pageApi";
export * from "./wordpress/mediaApi";

// Export propertyApi en renommant les fonctions pour éviter les conflits
export { 
  fetchProperties as fetchWordPressProperties,
  fetchPropertyById as fetchWordPressPropertyById,
  transformPropertyData
} from "./wordpress/propertyApi";

// Re-export FTP property API
export * from "./ftpPropertyApi";
