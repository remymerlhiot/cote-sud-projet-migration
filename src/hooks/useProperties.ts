import { useQuery } from "@tanstack/react-query";
import { fetchAllAnnonces } from "../services/fluxApi";
import { NormalizedProperty } from "../types";

export const useProperties = () =>
  useQuery<NormalizedProperty[], Error>({
    queryKey: ["properties"],      // anciennement : ["properties"]
    queryFn: fetchAllAnnonces,     // anciennement : fetchAllAnnonces
    // tu peux ajouter ici staleTime, cacheTime, etc. si besoin
  });
