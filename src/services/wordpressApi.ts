
// This file re-exports everything from the WordPress service modules
// for backward compatibility

export * from "./wordpress";
export {
  fetchWordPressProperties as fetchProperties,
  fetchWordPressPropertyById as fetchPropertyById,
  transformPropertyData as transformFTPPropertyData
} from "./wordpress";

