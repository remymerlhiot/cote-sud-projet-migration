
// This file re-exports everything from the WordPress service modules
// for backward compatibility, now including our new FTP service

export * from "./wordpress";
export {
  fetchWordPressProperties,
  fetchWordPressPropertyById
} from "./wordpress";
