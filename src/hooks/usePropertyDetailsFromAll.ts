
import { useParams } from "react-router-dom";
import { useProperties } from "./useProperties";
import { NormalizedProperty } from "../types";
import { useEffect } from "react";

export const usePropertyDetailsFromAll = (): {
  property?: NormalizedProperty;
  isLoading: boolean;
} => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProperties();

  const property = data?.find(p => p.id === Number(id));
  
  useEffect(() => {
    if (property) {
      // Log pour le débogage des images
      console.log(`Propriété ${id} trouvée, ${property.allImages.length} images disponibles`);
      if (property.allImages.length === 0) {
        console.warn(`Aucune image pour la propriété ${id}`);
      }
    } else if (!isLoading && data && data.length > 0) {
      console.warn(`Propriété ${id} non trouvée parmi ${data.length} propriétés disponibles`);
    }
  }, [property, id, data, isLoading]);
  
  return { property, isLoading };
};
