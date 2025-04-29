
import { useQuery } from "@tanstack/react-query";
import { 
  fetchProperties, 
  fetchPages, 
  fetchMedia, 
  fetchPageBySlug,
  WordPressProperty, 
  WordPressPage 
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

// Helper function to transform WordPress property data to our app's format
export const transformPropertyData = (wpProperty: WordPressProperty) => {
  const featuredImage = wpProperty._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
    "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"; // Fallback image
  
  return {
    id: wpProperty.id,
    title: wpProperty.title.rendered || "",
    location: wpProperty.acf?.location || "",
    ref: wpProperty.acf?.reference || `REF ${wpProperty.id}`,
    price: wpProperty.acf?.price || "Prix sur demande",
    area: wpProperty.acf?.area || "N/A",
    rooms: wpProperty.acf?.rooms || "N/A",
    bedrooms: wpProperty.acf?.bedrooms || "N/A",
    image: featuredImage,
  };
};
