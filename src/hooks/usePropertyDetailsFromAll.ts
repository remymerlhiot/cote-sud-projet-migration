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
      // Log plus détaillé pour le débogage des images
      console.log(`Propriété ${id} trouvée, ${property.allImages.length} images disponibles:`);
      if (property.allImages.length > 0) {
        console.log(`Première image: ${property.allImages[0]}`);
        console.log(`Dernière image: ${property.allImages[property.allImages.length - 1]}`);
        
        // Vérification rapide d'accessibilité de la première image
        const testImg = new Image();
        testImg.onload = () => console.log("✅ Première image accessible");
        testImg.onerror = () => console.error("❌ Première image inaccessible");
        testImg.src = property.allImages[0];
      } else {
        console.warn(`Aucune image pour la propriété ${id}`);
      }
    } else if (!isLoading && data && data.length > 0) {
      console.warn(`Propriété ${id} non trouvée parmi ${data.length} propriétés disponibles`);
    }
  }, [property, id, data, isLoading]);
  
  return { property, isLoading };
};