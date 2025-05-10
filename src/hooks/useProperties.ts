// src/hooks/useProperties.ts

import { useQuery } from "@tanstack/react-query";
import {
  fetchProperties as fetchWordPressProperties,
  fetchPropertyById as fetchWordPressPropertyById,
} from "@/services/wordpress/propertyApi";
import {
  fetchProperties as fetchFTPProperties,
  transformFTPPropertyData,
} from "@/services/ftpPropertyApi";
import type { TransformedProperty } from "@/services/wordpress/types";

/**
 * Récupère et transforme l'ensemble des propriétés
 * - WordPress : déjà transformées par fetchWordPressProperties()
 * - FTP       : transformFTPPropertyData() appliqué à chaque entrée brute
 */
const fetchAllProperties = async (): Promise<TransformedProperty[]> => {
  const [wpProps, ftpRaw] = await Promise.all([
    fetchWordPressProperties(),
    fetchFTPProperties(),
  ]);

  const ftpProps = ftpRaw.map(transformFTPPropertyData);

  // Fusion et tri décroissant par prix
  return [...wpProps, ...ftpProps].sort(
    (a, b) => b.priceNumber - a.priceNumber
  );
};

/**
 * Hook pour la liste complète des propriétés
 */
export const useProperties = () => {
  return useQuery<TransformedProperty[]>({
    queryKey: ["properties"],
    queryFn: fetchAllProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour une seule propriété par ID, WordPress d'abord puis FTP
 */
export const usePropertyById = (id: string | number) => {
  return useQuery<TransformedProperty | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      const numericId =
        typeof id === "string" ? parseInt(id, 10) : id;
      // 1) Essayer WordPress
      const wpResult = await fetchWordPressPropertyById(numericId);
      if (wpResult) {
        return wpResult;
      }
      // 2) Sinon, chercher dans FTP
      const ftpRaw = await fetchFTPProperties();
      const ftpProps = ftpRaw.map(transformFTPPropertyData);
      return ftpProps.find((p) => p.id === numericId) ?? null;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// Exporter le type TransformedProperty pour les composants qui l'utilisent
export type { TransformedProperty } from "@/services/wordpress/types";
