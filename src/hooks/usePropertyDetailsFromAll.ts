
import { usePropertyById } from "@/hooks/useProperties";
import { useAcfProperties, NormalizedProperty } from "@/hooks/useAcfProperties";
import { useQuery } from "@tanstack/react-query";
import { TransformedProperty } from "@/services/wordpress/types";

// Type unifié qui peut accueillir les deux formats de données
export type UnifiedPropertyDetails = TransformedProperty | NormalizedProperty;

/**
 * Hook qui tente de récupérer les détails d'une propriété depuis toutes les sources disponibles
 * @param id Identifiant de la propriété
 */
export const usePropertyDetailsFromAll = (id: string | number) => {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  
  // Récupérer depuis WordPress
  const wpQuery = usePropertyById(numericId);
  
  // Récupérer toutes les propriétés ACF pour trouver celle qui correspond
  const acfQuery = useAcfProperties({
    // N'activer cette requête que si la requête WordPress a échoué ou ne retourne rien
    enabled: wpQuery.isSuccess && !wpQuery.data ? true : false
  });
  
  // Requête combinée qui unifie les résultats
  return useQuery<UnifiedPropertyDetails | null, Error>({
    queryKey: ["property-all-sources", numericId],
    queryFn: async () => {
      // 1. Essayer avec WordPress d'abord
      if (wpQuery.isSuccess && wpQuery.data) {
        console.log(`Propriété #${numericId} trouvée dans WordPress`);
        return wpQuery.data;
      }
      
      // 2. Essayer avec ACF ensuite
      if (acfQuery.isSuccess && acfQuery.data) {
        const acfProperty = acfQuery.data.find(p => p.id === numericId);
        if (acfProperty) {
          console.log(`Propriété #${numericId} trouvée dans ACF`);
          return adaptACFToTransformed(acfProperty);
        }
      }
      
      // 3. Si pas trouvé, retourner null
      console.log(`Propriété #${numericId} non trouvée dans aucune source`);
      return null;
    },
    // Ne pas exécuter la requête combinée tant que les sous-requêtes ne sont pas prêtes
    enabled: wpQuery.isSuccess || acfQuery.isSuccess,
    // Garder en cache 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Adapter une propriété ACF normalisée au format TransformedProperty
 * pour compatibilité avec le composant PropertyDetail
 */
function adaptACFToTransformed(acfProp: NormalizedProperty): TransformedProperty {
  return {
    id: acfProp.id,
    title: acfProp.titre,
    location: acfProp.ville,
    ref: acfProp.reference,
    price: acfProp.prix,
    priceNumber: parseInt(acfProp.prix.replace(/[^0-9]/g, ""), 10) || 0,
    area: acfProp.surface,
    rooms: acfProp.pieces,
    bedrooms: acfProp.chambres,
    image: acfProp.image,
    allImages: acfProp.allImages,
    date: acfProp.date,
    description: acfProp.description,
    fullContent: acfProp.description, // ACF n'a pas de contenu complet séparé
    propertyType: acfProp.titre.split(" ")[0] || "PROPRIÉTÉ", // Utiliser le premier mot du titre comme type
    constructionYear: "",
    hasBalcony: false,
    hasElevator: false,
    hasTerrasse: false,
    hasPool: false,
    garageCount: "0", 
    dpe: "",
    // Ces champs supplémentaires ne sont pas disponibles dans ACF mais requis par TransformedProperty
    postalCode: "",
    address: "",
    country: "France",
    bathrooms: "",
    dpeValue: "",
    dpeGes: "",
    dpeGesValue: "",
    dpeDate: "",
    isNewConstruction: false,
    isPrestigious: false,
    isFurnished: false,
    isViager: false,
    negotiatorName: ""
  };
}
