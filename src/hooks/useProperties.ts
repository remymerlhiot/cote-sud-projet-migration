
import { useQuery } from "@tanstack/react-query";
import { fetchAllAnnonces } from "../services/fluxApi";
import { NormalizedProperty } from "@/types";

export const useProperties = () =>
  useQuery<NormalizedProperty[], Error>({
    queryKey: ["properties"],
    queryFn: fetchAllAnnonces,
  });

export type { NormalizedProperty };
