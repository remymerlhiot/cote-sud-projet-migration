
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parse as parseXML } from "https://deno.land/x/xml@2.1.3/mod.ts";
import { FTPClient } from "https://deno.land/x/ftp@v0.3.1/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to parse XML to JSON
function processXMLData(xmlString: string) {
  try {
    // Utiliser un parser XML compatible avec Deno
    const result = parseXML(xmlString);
    
    if (!result) {
      console.error("Failed to parse XML document");
      return [];
    }
    
    console.log("XML parsed successfully");
    
    // Extract properties
    const properties = [];
    
    // Find the LISTEANNONCES element (peut varier selon la structure XML)
    const listeAnnonces = findElement(result, "LISTEANNONCES") || 
                         findElement(result, "liste") ||
                         findElement(result, "annonces") || 
                         result;
                         
    if (!listeAnnonces) {
      console.error("No property list element found in XML");
      return [];
    }
    
    // Extract ANNONCE elements (peut varier selon la structure XML)
    const annonces = findElements(listeAnnonces, "ANNONCE") || 
                    findElements(listeAnnonces, "annonce") ||
                    findElements(listeAnnonces, "bien") || 
                    [];
                    
    if (annonces.length === 0) {
      console.error("No property elements found in XML");
      return [];
    }
    
    console.log(`Found ${annonces.length} properties in XML`);
    
    const tagMappings = {
      id: ["ID", "id", "identifiant", "reference"],
      reference: ["REFERENCE", "reference", "ref"],
      type: ["TYPE", "type", "type_bien"],
      title: ["TITRE", "titre", "title", "nom"],
      description: ["DESCRIPTIF", "description", "desc"],
      price: ["PRIX", "prix", "price"],
      address: ["ADRESSE", "adresse", "address"],
      postalCode: ["CP", "code_postal", "zip"],
      city: ["VILLE", "ville", "city"],
      country: ["PAYS", "pays", "country"],
      surface: ["SURFACE", "surface_habitable", "surface", "area"],
      rooms: ["NB_PIECES", "pieces", "nb_pieces", "rooms"],
      bedrooms: ["NB_CHAMBRES", "chambres", "nb_chambres", "bedrooms"],
      bathrooms: ["NB_SDB", "sdb", "nb_sdb", "bathrooms"],
      constructionYear: ["ANNEE_CONSTRUCTION", "annee", "year_built"],
      balcon: ["BALCON", "balcon", "balcony"],
      piscine: ["PISCINE", "piscine", "pool"],
      ascenseur: ["ASCENSEUR", "ascenseur", "elevator"],
      garage: ["GARAGE", "garage"],
      terrasse: ["TERRASSE", "terrasse"],
      dpe: ["DPE", "dpe", "classe_energie"]
    };
    
    // Helper to get value with multiple possible tag names
    const getTagValue = (annonce: any, mappings: string[]) => {
      for (const tag of mappings) {
        const value = getElementValue(annonce, tag);
        if (value) return value;
      }
      return "";
    };
    
    for (const annonce of annonces) {
      // Journaliser pour debug
      console.log("Processing property:", getTagValue(annonce, tagMappings.reference));
      
      const property = {
        id: getTagValue(annonce, tagMappings.id),
        reference: getTagValue(annonce, tagMappings.reference),
        type: getTagValue(annonce, tagMappings.type),
        title: getTagValue(annonce, tagMappings.title),
        description: getTagValue(annonce, tagMappings.description),
        price: getTagValue(annonce, tagMappings.price),
        address: getTagValue(annonce, tagMappings.address),
        postalCode: getTagValue(annonce, tagMappings.postalCode),
        city: getTagValue(annonce, tagMappings.city),
        country: getTagValue(annonce, tagMappings.country),
        surface: getTagValue(annonce, tagMappings.surface),
        rooms: getTagValue(annonce, tagMappings.rooms),
        bedrooms: getTagValue(annonce, tagMappings.bedrooms),
        bathrooms: getTagValue(annonce, tagMappings.bathrooms),
        constructionYear: getTagValue(annonce, tagMappings.constructionYear),
        features: {
          hasBalcony: getTagValue(annonce, tagMappings.balcon) === "1",
          hasPool: getTagValue(annonce, tagMappings.piscine) === "1",
          hasElevator: getTagValue(annonce, tagMappings.ascenseur) === "1", 
          hasGarage: getTagValue(annonce, tagMappings.garage) === "1",
          hasTerrasse: getTagValue(annonce, tagMappings.terrasse) === "1",
        },
        photos: extractPhotos(annonce),
        dpe: getTagValue(annonce, tagMappings.dpe),
      };
      
      // Journaliser les données critiques manquantes
      if (!property.surface || !property.rooms) {
        console.warn(`[XML] Données manquantes pour la propriété ${property.reference}`, {
          surface: property.surface,
          rooms: property.rooms
        });
      }
      
      properties.push(property);
    }
    
    return properties;
  } catch (error) {
    console.error("Error parsing XML:", error);
    return [];
  }
}

// Helper function to find an element by name in the parsed XML
function findElement(elements: any, tagName: string): any {
  if (!elements) return null;
  
  // Si elements est un objet et contient directement la propriété tagName
  if (elements[tagName]) return elements[tagName];
  
  // Si elements est un tableau
  if (Array.isArray(elements)) {
    for (const item of elements) {
      if (item.name === tagName || item.tagName === tagName) {
        return item;
      }
      
      // Recherche récursive dans les enfants
      if (item.children || item.elements) {
        const found = findElement(item.children || item.elements, tagName);
        if (found) return found;
      }
    }
  }
  
  // Si elements a des propriétés children ou elements
  if (elements.children || elements.elements) {
    return findElement(elements.children || elements.elements, tagName);
  }
  
  return null;
}

// Helper function to find all elements with a specific name
function findElements(parent: any, tagName: string): any[] {
  const result: any[] = [];
  
  if (!parent) return result;
  
  // Si parent est un tableau d'éléments
  if (Array.isArray(parent)) {
    for (const item of parent) {
      if (item.name === tagName || item.tagName === tagName) {
        result.push(item);
      }
    }
    return result;
  }
  
  // Si parent est un objet avec la propriété tagName
  if (parent[tagName]) {
    const elements = parent[tagName];
    if (Array.isArray(elements)) {
      return elements;
    } else {
      return [elements];
    }
  }
  
  // Si parent a des children
  if (parent.children || parent.elements) {
    const children = parent.children || parent.elements;
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child.name === tagName || child.tagName === tagName) {
          result.push(child);
        }
      }
    }
  }
  
  return result;
}

// Helper function to get element value
function getElementValue(parent: any, tagName: string): string {
  const element = findElement(parent, tagName);
  
  if (!element) return "";
  
  // Si l'élément est une chaîne de caractères simple
  if (typeof element === 'string') return element;
  
  // Si l'élément a une propriété text ou value
  if (element.text) return element.text;
  if (element.value) return element.value;
  
  // Si l'élément a des enfants de type texte
  if (element.children && Array.isArray(element.children)) {
    for (const child of element.children) {
      if (typeof child === 'string') return child;
      if (child.type === 'text') return child.text || "";
    }
  }
  
  // Si l'élément a un contenu
  if (element.content) return element.content;
  
  return "";
}

// Helper to extract photos
function extractPhotos(annonce: any): string[] {
  const photos = [];
  
  // Essayer plusieurs structures possibles
  const photoElements = 
    findElements(annonce, "PHOTO") || 
    findElements(annonce, "photo") || 
    findElements(annonce, "image") || 
    findElements(annonce, "IMAGES") || 
    [];
  
  for (const photoElement of photoElements) {
    // Si photoElement est une chaîne de caractères
    if (typeof photoElement === 'string' && photoElement.trim() !== '') {
      photos.push(photoElement);
      continue;
    }
    
    // Si photoElement a une propriété text ou value
    if (photoElement.text && photoElement.text.trim() !== '') {
      photos.push(photoElement.text);
      continue;
    }
    if (photoElement.value && photoElement.value.trim() !== '') {
      photos.push(photoElement.value);
      continue;
    }
    
    // Si photoElement a un attribut url ou src
    if (photoElement.attributes) {
      const url = photoElement.attributes.url || photoElement.attributes.src;
      if (url) {
        photos.push(url);
        continue;
      }
    }
    
    // Si photoElement a une URL dans son contenu (enfants texte)
    if (photoElement.children && Array.isArray(photoElement.children)) {
      for (const child of photoElement.children) {
        if (typeof child === 'string' && child.trim() !== '') {
          photos.push(child);
          break;
        }
      }
    }
  }
  
  return photos;
}

// For development, mock XML data instead of FTP
// This helps to avoid FTP connection errors during development
function getMockXMLData() {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <LISTEANNONCES>
    <ANNONCE>
      <ID>1001</ID>
      <REFERENCE>REF-1001</REFERENCE>
      <TYPE>APPARTEMENT</TYPE>
      <TITRE>Bel appartement avec vue</TITRE>
      <DESCRIPTIF>Magnifique appartement avec une vue imprenable sur la ville. Très lumineux et rénové avec goût.</DESCRIPTIF>
      <PRIX>850000</PRIX>
      <ADRESSE>12 Rue de la Paix</ADRESSE>
      <CP>13100</CP>
      <VILLE>Aix-en-Provence</VILLE>
      <PAYS>France</PAYS>
      <SURFACE>120</SURFACE>
      <NB_PIECES>5</NB_PIECES>
      <NB_CHAMBRES>3</NB_CHAMBRES>
      <NB_SDB>2</NB_SDB>
      <ANNEE_CONSTRUCTION>2010</ANNEE_CONSTRUCTION>
      <BALCON>1</BALCON>
      <PISCINE>0</PISCINE>
      <ASCENSEUR>1</ASCENSEUR>
      <GARAGE>1</GARAGE>
      <TERRASSE>1</TERRASSE>
      <PHOTO>https://images.unsplash.com/photo-1502672260266-1c1ef2d93688</PHOTO>
      <PHOTO>https://images.unsplash.com/photo-1560448204-e02f11c3d0c2</PHOTO>
      <DPE>A</DPE>
    </ANNONCE>
    <ANNONCE>
      <ID>1002</ID>
      <REFERENCE>REF-1002</REFERENCE>
      <TYPE>MAISON</TYPE>
      <TITRE>Villa d'exception</TITRE>
      <DESCRIPTIF>Superbe villa avec piscine et jardin arboré. Prestations de qualité.</DESCRIPTIF>
      <PRIX>1250000</PRIX>
      <ADRESSE>45 Chemin des Oliviers</ADRESSE>
      <CP>84000</CP>
      <VILLE>Avignon</VILLE>
      <PAYS>France</PAYS>
      <SURFACE>220</SURFACE>
      <NB_PIECES>7</NB_PIECES>
      <NB_CHAMBRES>4</NB_CHAMBRES>
      <NB_SDB>3</NB_SDB>
      <ANNEE_CONSTRUCTION>2005</ANNEE_CONSTRUCTION>
      <BALCON>0</BALCON>
      <PISCINE>1</PISCINE>
      <ASCENSEUR>0</ASCENSEUR>
      <GARAGE>2</GARAGE>
      <TERRASSE>1</TERRASSE>
      <PHOTO>https://images.unsplash.com/photo-1580587771525-78b9dba3b914</PHOTO>
      <PHOTO>https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83</PHOTO>
      <DPE>B</DPE>
    </ANNONCE>
    <ANNONCE>
      <ID>1003</ID>
      <REFERENCE>REF-1003</REFERENCE>
      <TYPE>DUPLEX</TYPE>
      <TITRE>Duplex de prestige</TITRE>
      <DESCRIPTIF>Exceptionnel duplex au cœur du centre historique. Volumes et matériaux nobles.</DESCRIPTIF>
      <PRIX>1820000</PRIX>
      <ADRESSE>8 Rue des Arts</ADRESSE>
      <CP>13210</CP>
      <VILLE>SAINT REMY DE PROVENCE</VILLE>
      <PAYS>France</PAYS>
      <SURFACE>175</SURFACE>
      <NB_PIECES>6</NB_PIECES>
      <NB_CHAMBRES>3</NB_CHAMBRES>
      <NB_SDB>2</NB_SDB>
      <ANNEE_CONSTRUCTION>1890</ANNEE_CONSTRUCTION>
      <BALCON>1</BALCON>
      <PISCINE>0</PISCINE>
      <ASCENSEUR>1</ASCENSEUR>
      <GARAGE>1</GARAGE>
      <TERRASSE>1</TERRASSE>
      <PHOTO>https://images.unsplash.com/photo-1560185007-cde436f6a4d0</PHOTO>
      <PHOTO>https://images.unsplash.com/photo-1600607687644-a677735abf7d</PHOTO>
      <DPE>C</DPE>
    </ANNONCE>
    <ANNONCE>
      <ID>1004</ID>
      <REFERENCE>REF-1004</REFERENCE>
      <TYPE>APPARTEMENT</TYPE>
      <TITRE>Studio rénové</TITRE>
      <DESCRIPTIF>Studio entièrement rénové idéal pour investissement locatif.</DESCRIPTIF>
      <PRIX>195000</PRIX>
      <ADRESSE>22 Avenue Jean Jaurès</ADRESSE>
      <CP>30000</CP>
      <VILLE>Nîmes</VILLE>
      <PAYS>France</PAYS>
      <SURFACE>35</SURFACE>
      <NB_PIECES>1</NB_PIECES>
      <NB_CHAMBRES>0</NB_CHAMBRES>
      <NB_SDB>1</NB_SDB>
      <ANNEE_CONSTRUCTION>1970</ANNEE_CONSTRUCTION>
      <BALCON>0</BALCON>
      <PISCINE>0</PISCINE>
      <ASCENSEUR>1</ASCENSEUR>
      <GARAGE>0</GARAGE>
      <TERRASSE>0</TERRASSE>
      <PHOTO>https://images.unsplash.com/photo-1522708323590-d24dbb6b0267</PHOTO>
      <DPE>D</DPE>
    </ANNONCE>
    <ANNONCE>
      <ID>1005</ID>
      <REFERENCE>REF-1005</REFERENCE>
      <TYPE>MAISON</TYPE>
      <TITRE>Mas provençal rénové</TITRE>
      <DESCRIPTIF>Authentique mas provençal entièrement rénové avec piscine et oliviers centenaires.</DESCRIPTIF>
      <PRIX>1580000</PRIX>
      <ADRESSE>Chemin des Lavandes</ADRESSE>
      <CP>84220</CP>
      <VILLE>Gordes</VILLE>
      <PAYS>France</PAYS>
      <SURFACE>280</SURFACE>
      <NB_PIECES>8</NB_PIECES>
      <NB_CHAMBRES>5</NB_CHAMBRES>
      <NB_SDB>3</NB_SDB>
      <ANNEE_CONSTRUCTION>1850</ANNEE_CONSTRUCTION>
      <BALCON>0</BALCON>
      <PISCINE>1</PISCINE>
      <ASCENSEUR>0</ASCENSEUR>
      <GARAGE>2</GARAGE>
      <TERRASSE>1</TERRASSE>
      <PHOTO>https://images.unsplash.com/photo-1600607688969-a5bfcd646154</PHOTO>
      <PHOTO>https://images.unsplash.com/photo-1600585154363-67eb9e2e2099</PHOTO>
      <PHOTO>https://images.unsplash.com/photo-1600566753151-384129cf4e3e</PHOTO>
      <DPE>C</DPE>
    </ANNONCE>
  </LISTEANNONCES>`;
}

async function fetchXMLFromFTP(): Promise<string> {
  // En production, on utilise la connexion FTP réelle
  const client = new FTPClient();
  let xmlContent = "";

  try {
    // Informations de connexion FTP
    await client.connect({
      host: "agence-axo.immo",  // Votre hôte FTP
      port: 21,                 // Port standard FTP
      username: "xmladapt@agence-axo.immo", // Votre nom d'utilisateur
      password: "^!@b+EadZ36z"  // Votre mot de passe
    });

    console.log("Connecté au serveur FTP, récupération du fichier XML...");

    // Récupération du fichier XML
    const fileReader = await client.get("85002.xml"); // Votre nom de fichier
    if (fileReader) {
      const fileContent = await Deno.readAll(fileReader);
      xmlContent = new TextDecoder().decode(fileContent);
      console.log("Fichier XML récupéré avec succès");
    } else {
      console.error("Impossible de lire le fichier XML");
      // En cas d'échec, utiliser les données mockées
      xmlContent = getMockXMLData();
    }

    // Fermeture de la connexion
    await client.close();
    console.log("Connexion FTP fermée");

    return xmlContent;
  } catch (error) {
    console.error("Erreur FTP:", error);
    if (client && client.connected) {
      try {
        await client.close();
        console.log("Connexion FTP fermée après erreur");
      } catch (closeError) {
        console.error("Erreur lors de la fermeture de la connexion FTP:", closeError);
      }
    }
    
    // En cas d'erreur, utiliser les données mockées
    console.log("Utilisation des données de démonstration suite à l'erreur FTP");
    return getMockXMLData();
  }
}

// Handle cached data
let cachedProperties: any[] = [];
let lastFetched: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = Date.now();
    // Check if we need to fetch fresh data
    if (cachedProperties.length === 0 || now - lastFetched > CACHE_DURATION) {
      console.log("Fetching fresh properties from FTP or mock data...");
      
      try {
        const xmlContent = await fetchXMLFromFTP();
        if (xmlContent) {
          console.log(`XML content fetched: ${xmlContent.length} bytes`);
          cachedProperties = processXMLData(xmlContent);
          lastFetched = now;
          console.log(`Successfully fetched ${cachedProperties.length} properties`);
        } else {
          console.error("No XML content retrieved");
        }
      } catch (ftpError) {
        console.error("Failed to fetch from FTP:", ftpError);
        // If cache is empty, use mock data as fallback
        if (cachedProperties.length === 0) {
          console.log("Using mock data as fallback due to error");
          const mockXML = getMockXMLData();
          cachedProperties = processXMLData(mockXML);
        } else {
          // Otherwise use stale cache and log warning
          console.warn("Using stale cache due to FTP error");
        }
      }
    } else {
      console.log("Using cached properties data");
    }

    // Return the properties
    return new Response(JSON.stringify({ 
      properties: cachedProperties,
      cachedAt: lastFetched,
      freshData: (now - lastFetched <= CACHE_DURATION)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in fetch-properties function:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      properties: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
