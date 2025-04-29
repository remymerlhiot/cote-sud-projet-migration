
import { useQuery } from "@tanstack/react-query";
import { fetchPageBySlug } from "@/services/wordpressApi";

export const useAccueilPage = () => {
  return useQuery({
    queryKey: ["page", "accueil"],
    queryFn: () => fetchPageBySlug("accueil"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
