
// This file re-exports everything from the WordPress service modules
// for backward compatibility

export * from "./wordpress";
export {
  fetchProperties as fetchProperties,
  fetchPropertyById as fetchPropertyById,
  transformPropertyData as transformFTPPropertyData
} from "./wordpress";

