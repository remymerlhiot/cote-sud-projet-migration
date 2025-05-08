
import { useQuery } from "@tanstack/react-query";
import { 
  fetchWordPressProperties, 
  fetchWordPressPropertyById,
  transformPropertyData,
  TransformedProperty
} from "@/services/wordpress";

// Fetch all properties using WordPress API instead of FTP
export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const wpProperties = await fetchWordPressProperties();
      // Les propriétés sont déjà transformées par fetchWordPressProperties
      return wpProperties.sort((a, b) => b.priceNumber - a.priceNumber);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch a single property by ID from WordPress
export const usePropertyById = (id: string | number) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const stringId = id.toString();
      const numericId = parseInt(stringId);
      if (isNaN(numericId)) return null;

      return await fetchWordPressPropertyById(numericId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

// Re-export the transform function and helper functions from WordPress services
export { transformPropertyData };

// Re-export the image validation helper to maintain compatibility
export const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
  return url;
};

export type { TransformedProperty };
