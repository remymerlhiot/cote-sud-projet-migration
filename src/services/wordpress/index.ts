
// Re-export all types
export * from "@/types";

// Re-export config
export * from "./config";

// Re-export transformers
export * from "./transformers";

// Re-export API functions
export * from "./pageApi";
export * from "./mediaApi";

// Export propertyApi mais en évitant les conflits de nommage
export { 
  fetchProperties as fetchWordPressProperties,
  fetchPropertyById as fetchWordPressPropertyById
} from "./propertyApi";

// Export explicite de la transformation des données
export { transformPropertyData } from "./transformers";

// Re-export FTP property API
export * from "../ftpPropertyApi";
