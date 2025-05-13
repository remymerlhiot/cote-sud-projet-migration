export const fetchProperties = async (): Promise<NormalizedProperty[]> => {
  try {
    // Requête avec paramètres explicites pour inclure toutes les données nécessaires
    const response = await fetch(
      `${API_BASE_URL}/annonce?_embed=1&per_page=40&_fields=id,title,content,excerpt,date,acf,galerie_elementor,_links,_embedded`
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching properties: ${response.statusText}`);
    }
    
    const data: WordPressAnnonce[] = await response.json();
    
    // Log détaillé pour débugger
    console.log(`API: ${data.length} propriétés récupérées`);
    
    if (data.length > 0) {
      // Vérifier la structure des données pour la première propriété
      const firstProp = data[0];
      console.log("Structure de données pour la première propriété:", {
        id: firstProp.id,
        title: firstProp.title?.rendered,
        hasGalerie: Boolean(firstProp.galerie_elementor && firstProp.galerie_elementor.length > 0),
        hasFeatured: Boolean(firstProp._embedded && firstProp._embedded["wp:featuredmedia"]),
        hasAttachments: Boolean(firstProp._embedded && firstProp._embedded["wp:attachment"]),
        attachmentCount: firstProp._embedded?.["wp:attachment"]?.length || 0
      });
      
      // Si galerie_elementor existe, vérifier son format
      if (firstProp.galerie_elementor && firstProp.galerie_elementor.length > 0) {
        console.log("Format de galerie_elementor:", 
          typeof firstProp.galerie_elementor[0], 
          firstProp.galerie_elementor[0]);
      }
    }
    
    // Transformer les données en utilisant normalizePropertyData
    return data.map((property) => transformPropertyData(property, null));
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    toast.error("Impossible de récupérer les biens immobiliers");
    return [];
  }
};

export const fetchPropertyById = async (id: number): Promise<NormalizedProperty | null> => {
  try {
    // 1) Récupérer la propriété avec les médias incorporés
    const res = await fetch(`${API_BASE_URL}/annonce/${id}?_embed=1`);
    
    if (!res.ok) throw new Error(res.statusText);
    
    const data: WordPressAnnonce = await res.json();
    
    console.log(`Property ${id}: Données principales récupérées`, {
      hasGalerie: Boolean(data.galerie_elementor && data.galerie_elementor.length > 0),
      hasFeatured: Boolean(data._embedded && data._embedded["wp:featuredmedia"]),
      hasAttachments: Boolean(data._embedded && data._embedded["wp:attachment"]),
      attachmentCount: data._embedded?.["wp:attachment"]?.length || 0
    });
    
    // 2) Si pas de médias attachés, essayer de les récupérer explicitement
    if (!data._embedded?.["wp:attachment"] || data._embedded["wp:attachment"].length === 0) {
      console.log(`Property ${id}: Pas de médias attachés, récupération explicite...`);
      
      // Récupérer les médias attachés à ce post
      const mediaRes = await fetch(`${API_BASE_URL}/media?parent=${id}&per_page=50&media_type=image`);
      
      if (mediaRes.ok) {
        const attachments = await mediaRes.json();
        console.log(`Property ${id}: ${attachments.length} médias récupérés explicitement`);
        
        // Ajouter les médias à l'objet _embedded
        if (!data._embedded) {
          data._embedded = {};
        }
        
        data._embedded["wp:attachment"] = attachments;
      }
    }
    
    // 3) Transformer les données
    const transformed = transformPropertyData(data, null);
    
    console.log(`Property ${id}: Transformation terminée avec ${transformed.allImages.length} images`);
    console.log(`Property ${id}: URLs des images:`, transformed.allImages);
    
    return transformed;
  } catch (error) {
    console.error(`Failed to fetch property #${id}:`, error);
    toast.error("Impossible de récupérer les détails du bien immobilier");
    return null;
  }
};
