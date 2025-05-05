
import { useQuery } from "@tanstack/react-query";
import { fetchCustomPageBySlug } from "@/services/wordpress";

export const useNotreHistoire = (alternativeSlug?: string) => {
  // Try "notre-histoire" first, but allow fallback to another slug if needed
  const primarySlug = "notre-histoire";
  const slug = alternativeSlug || primarySlug;
  
  return useQuery({
    queryKey: ["notre-histoire-page", slug],
    queryFn: () => fetchCustomPageBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false,
  });
};
