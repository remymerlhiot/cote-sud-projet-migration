// src/hooks/useProperties.ts

import { useQuery } from "@tanstack/react-query";
import { fetchWordPressProperties } from "@/services/wordpress/propertyApi";
import { fetchProperties as fetchFTPProperties } from "@/services/ftpPropertyApi";
import { transformFTPPropertyData } from "@/services/ftpPropertyApi";
import type { TransformedProperty } from "@/services/wordpress/types";

/**
 * Récupère et transforme l'ensemble des propriétés
 * - WordPress : déjà transformées par fetchWordPressProperties()
 * - FTP       : on applique transformFTPPropertyData()
 */
const fetchAllProperties = async (): Promise<TransformedProperty[]> => {
  const [wpProps, ftpRaw] = await Promise.all([
    fetchWordPressProperties(),
    fetchFTPProperties(),
  ]);

  const ftpProps = ftpRaw.map(transformFTPPropertyData);

  // Fusion + tri décroissant par prix
  return [...wpProps, ...ftpProps].sort((a, b) => b.priceNumber - a.priceNumber);
};

/**
 * Hook pour la liste de toutes les propriétés
 */
export const useProperties = () => {
  return useQuery<TransformedProperty[]>({
    queryKey: ["properties"],
    queryFn: fetchAllProperties,
    staleTime: 5 * 60 * 1000, // 5 min
  });
};

/**
 * Hook pour une propriété unique par ID,
 * qu'elle vienne de WP ou du FTP
 */
export const usePropertyById = (id: string | number) => {
  return useQuery<TransformedProperty | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      const all = await fetchAllProperties();
      return all.find(p => p.id === numericId) ?? null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};
