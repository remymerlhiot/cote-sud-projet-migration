
import { useQuery } from "@tanstack/react-query";
import { fetchTemplateAttachments } from "@/services/elementorAttachments";

/**
 * Retourne les URLs d'images d'un template Elementor.
 */
export const useTemplateImages = (templateId: number) =>
  useQuery<string[]>({
    queryKey: ["templateImages", templateId],
    queryFn: () => fetchTemplateAttachments(templateId),
    staleTime: 1000 * 60 * 30, // 30 min
  });
