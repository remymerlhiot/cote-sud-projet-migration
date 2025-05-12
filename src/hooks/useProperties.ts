import { useQuery } from "@tanstack/react-query";
import { fetchAllAnnonces } from "../services/fluxApi";
import { TransformedProperty, NormalizedProperty } from "../types";

export const useProperties = () =>
  useQuery<NormalizedProperty[], Error>(["properties"], fetchAllAnnonces);
