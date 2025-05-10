// src/services/wordpressApi.ts

// On ré-exporte uniquement ce que la couche WordPress propose réellement :

export { fetchProperties, fetchPropertyById } from "./wordpress/propertyApi";
export { transformPropertyData } from "./wordpress/transformers";
