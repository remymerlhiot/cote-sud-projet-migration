
/**
 * Récupère les images attachées à un template Elementor.
 * @param templateId  ID du post 'elementor_library'
 * @returns           Tableau d'URL (string[])
 */
export const fetchTemplateAttachments = async (
  templateId: number
): Promise<string[]> => {
  const res = await fetch(
    `/wp-json/wp/v2/media?parent=${templateId}&per_page=100`
  );
  if (!res.ok) throw new Error("Aucun média trouvé");
  const medias = await res.json();
  return medias
    .filter((m: any) => m.media_type === "image" && m.source_url)
    .map((m: any) => m.source_url);
};
