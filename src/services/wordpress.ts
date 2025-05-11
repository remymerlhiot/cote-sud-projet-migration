// src/services/wordpress.ts

// Ce fichier ré-exporte les modules clés des services WordPress
// pour maintenir la compatibilité et centraliser les exports.

// Types et configuration
export * from "./wordpress/types";
export * from "./wordpress/config";

// Fonctions de transformation et hooks auxiliaires
export * from "./wordpress/transformers";
export * from "./wordpress/pageApi";
export * from "./wordpress/mediaApi";

// API principale pour les annonces
export {
  fetchProperties as fetchWordPressProperties,
  fetchPropertyById as fetchWordPressPropertyById
} from "./wordpress/propertyApi";

// Export explicite de la transformation des données
export { transformPropertyData } from "./wordpress/transformers";

// Ré-export de l'API des propriétés FTP
export * from "./ftpPropertyApi";
