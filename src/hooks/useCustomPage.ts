
import { useQuery } from "@tanstack/react-query";
import { fetchCustomPageBySlug, fetchPageBySlug } from "@/services/wordpress/pageApi";
import { CustomWordPressPage } from "@/services/wordpress/types";
import { toast } from "@/components/ui/sonner";

interface UseCustomPageOptions {
  enabled?: boolean;
  staleTime?: number;
  showErrors?: boolean;
}

export const useCustomPage = (slug: string, options: UseCustomPageOptions = {}) => {
  const { enabled = true, staleTime = 10 * 60 * 1000, showErrors = false } = options;
  
  return useQuery<CustomWordPressPage | null, Error>({
    queryKey: ["custom-page", slug],
    queryFn: async () => {
      try {
        // First attempt to use the custom API
        const customPage = await fetchCustomPageBySlug(slug);
        if (customPage) {
          console.log(`Successfully fetched page "${slug}" from custom API`);
          return customPage;
        }
      } catch (error) {
        console.error(`Failed to fetch from custom API for slug "${slug}":`, error);
        // Don't show toast here as we'll try the fallback
      }

      // If custom API fails, try standard WordPress API as fallback
      try {
        console.log(`Attempting fallback to standard WordPress API for slug "${slug}"`);
        const standardPage = await fetchPageBySlug(slug);
        
        if (standardPage) {
          // Transform standard page to match CustomWordPressPage format
          return {
            title: standardPage.title.rendered,
            content: standardPage.content.rendered, 
            featured_image: standardPage.featured_media_url || null,
            elementor_data: null, // Not available in standard API
            media_list: standardPage.featured_media_url ? [standardPage.featured_media_url] : []
          };
        }
        
        // If both APIs fail, return null
        return null;
      } catch (error) {
        console.error(`Fallback also failed for "${slug}":`, error);
        if (showErrors) {
          toast.error(`Impossible de charger la page "${slug}"`);
        }
        return null;
      }
    },
    staleTime,
    enabled: !!slug && enabled,
  });
};
