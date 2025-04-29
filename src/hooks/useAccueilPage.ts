
import { useQuery } from "@tanstack/react-query";
import { fetchPageBySlug } from "@/services/wordpressApi";

export const useAccueilPage = () => {
  return useQuery({
    queryKey: ["page", "new-home"],
    queryFn: () => fetchPageBySlug("new-home"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
