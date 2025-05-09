// src/services/wordpressApi.ts

// Re-export de tous les exports du dossier WordPress
export * from "./wordpress";

// Export des fonctions FTP (fetch + transform) depuis ftpPropertyApi.ts
export {
  fetchProperties     as fetchFTPProperties,
  fetchPropertyById   as fetchFTPPropertyById,
  transformFTPPropertyData
} from "./ftpPropertyApi";
