import { useParams } from "react-router-dom";
import { useProperties } from "./useProperties";
import { NormalizedProperty } from "../types";

export const usePropertyDetailsFromAll = (): {
  property?: NormalizedProperty;
  isLoading: boolean;
} => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProperties();

  const property = data?.find(p => p.id === Number(id));
  return { property, isLoading };
};
