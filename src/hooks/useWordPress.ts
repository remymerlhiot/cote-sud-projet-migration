
import { useQuery } from "@tanstack/react-query";
import { 
  fetchProperties, 
  fetchPages, 
  fetchMedia, 
  fetchPageBySlug,
  WordPressProperty,
  WordPressAnnonce,
  transformPropertyData
} from "@/services/wordpressApi";

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: fetchPages,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: () => fetchPageBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

export const useMedia = (mediaId: number) => {
  return useQuery({
    queryKey: ["media", mediaId],
    queryFn: () => fetchMedia(mediaId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!mediaId,
  });
};

// Re-export the transform function for convenience
export { transformPropertyData };
