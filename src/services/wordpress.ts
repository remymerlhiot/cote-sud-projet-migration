
// This file re-exports everything from the WordPress service modules
// for backward compatibility

export * from "./wordpress/types";
export * from "./wordpress/config";
export * from "./wordpress/transformers";
export * from "./wordpress/pageApi";
export * from "./wordpress/mediaApi";

// Export propertyApi en évitant les conflits de nommage
export { 
  fetchProperties,
  fetchPropertyById,
  transformPropertyData
} from "./wordpress/propertyApi";

// Re-export FTP property API
export * from "./ftpPropertyApi";
