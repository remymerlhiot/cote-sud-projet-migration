
import { useQuery } from "@tanstack/react-query";
import { fetchAllAnnonces, NormalizedProperty } from "@/services/fluxApi";
import { toast } from "@/components/ui/sonner";

interface UseAcfPropertiesOptions {
  enabled?: boolean;
  staleTime?: number;
  showErrors?: boolean;
}

/**
 * Hook pour récupérer les propriétés depuis l'API WordPress avec ACF
 */
export const useAcfProperties = (options: UseAcfPropertiesOptions = {}) => {
  const { 
    enabled = true, 
    staleTime = 5 * 60 * 1000, // 5 minutes par défaut
    showErrors = true 
  } = options;

  return useQuery<NormalizedProperty[], Error>({
    queryKey: ["acf-properties"],
    queryFn: async () => {
      try {
        console.log("Démarrage de la récupération des propriétés ACF...");
        const properties = await fetchAllAnnonces();
        console.log(`Récupéré ${properties.length} propriétés depuis l'API ACF`);
        return properties;
      } catch (error) {
        console.error("Erreur lors de la récupération des propriétés ACF:", error);
        if (showErrors) {
          toast.error("Impossible de récupérer les propriétés immobilières");
        }
        throw error;
      }
    },
    staleTime,
    enabled,
  });
};

// Réexporter le type pour faciliter l'utilisation
export type { NormalizedProperty } from "@/services/fluxApi";
