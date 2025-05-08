
import { useQuery } from "@tanstack/react-query";
import { fetchProperties, fetchPropertyById, transformFTPPropertyData } from "@/services/ftpPropertyApi";
import type { TransformedProperty } from "@/services/wordpress/types";

// Fetch all properties
export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const ftpProperties = await fetchProperties();
      // Transform each property to our standard format
      return ftpProperties.map(prop => transformFTPPropertyData(prop));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch a single property by ID
export const usePropertyById = (id: string | number) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const stringId = id.toString();
      const ftpProperty = await fetchPropertyById(stringId);
      if (!ftpProperty) return null;
      // Transform to our standard format
      return transformFTPPropertyData(ftpProperty);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

// Re-export the transform function and types for convenience
export { transformFTPPropertyData };
export type { TransformedProperty };
