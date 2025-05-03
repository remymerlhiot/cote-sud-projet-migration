
import { useQuery } from "@tanstack/react-query";
import { fetchCustomPageBySlug, CustomWordPressPage } from "@/services/wordpress";

interface UseCustomPageOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useCustomPage = (slug: string, options: UseCustomPageOptions = {}) => {
  const { enabled = true, staleTime = 10 * 60 * 1000 } = options;
  
  return useQuery<CustomWordPressPage | null, Error>({
    queryKey: ["custom-page", slug],
    queryFn: () => fetchCustomPageBySlug(slug),
    staleTime,
    enabled: !!slug && enabled,
  });
};
