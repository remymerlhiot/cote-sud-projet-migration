import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { FTPClient } from "https://deno.land/x/ftp@v1.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to parse XML to JSON
function parseXML(xmlString: string) {
  try {
    // Basic XML parsing - in a production environment, use a more robust XML parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Extract properties
    const properties = [];
    const annonces = xmlDoc.getElementsByTagName("ANNONCE");
    
    for (let i = 0; i < annonces.length; i++) {
      const annonce = annonces[i];
      const property = {
        id: getNodeValue(annonce, "ID"),
        reference: getNodeValue(annonce, "REFERENCE"),
        type: getNodeValue(annonce, "TYPE"),
        title: getNodeValue(annonce, "TITRE"),
        description: getNodeValue(annonce, "DESCRIPTIF"),
        price: getNodeValue(annonce, "PRIX"),
        address: getNodeValue(annonce, "ADRESSE"),
        postalCode: getNodeValue(annonce, "CP"),
        city: getNodeValue(annonce, "VILLE"),
        country: getNodeValue(annonce, "PAYS"),
        surface: getNodeValue(annonce, "SURFACE"),
        rooms: getNodeValue(annonce, "NB_PIECES"),
        bedrooms: getNodeValue(annonce, "NB_CHAMBRES"),
        bathrooms: getNodeValue(annonce, "NB_SDB"),
        constructionYear: getNodeValue(annonce, "ANNEE_CONSTRUCTION"),
        features: {
          hasBalcony: getNodeValue(annonce, "BALCON") === "1",
          hasPool: getNodeValue(annonce, "PISCINE") === "1",
          hasElevator: getNodeValue(annonce, "ASCENSEUR") === "1", 
          hasGarage: getNodeValue(annonce, "GARAGE") === "1",
          hasTerrasse: getNodeValue(annonce, "TERRASSE") === "1",
        },
        photos: parsePhotos(annonce),
        dpe: getNodeValue(annonce, "DPE"),
      };
      
      properties.push(property);
    }
    
    return properties;
  } catch (error) {
    console.error("Error parsing XML:", error);
    return [];
  }
}

// Helper to extract node value
function getNodeValue(parentNode: Element, tagName: string): string {
  try {
    const node = parentNode.getElementsByTagName(tagName)[0];
    return node ? node.textContent || "" : "";
  } catch (e) {
    return "";
  }
}

// Helper to extract photos
function parsePhotos(annonce: Element): string[] {
  try {
    const photos = [];
    const photoNodes = annonce.getElementsByTagName("PHOTO");
    
    for (let i = 0; i < photoNodes.length; i++) {
      const url = photoNodes[i].textContent;
      if (url) photos.push(url);
    }
    
    return photos;
  } catch (e) {
    return [];
  }
}

async function fetchXMLFromFTP(): Promise<string> {
  const client = new FTPClient();
  let xmlContent = "";

  try {
    // FTP connection details
    await client.connect({
      host: "ftp.monserveur.com",
      port: 21,
      username: "utilisateur",
      password: "motdepasse"
    });

    // Navigate to directory if needed
    // await client.cd("/path/to/directory");

    // Get file content as text
    const fileReader = await client.get("85002.xml");
    if (fileReader) {
      const fileContent = await Deno.readAll(fileReader);
      xmlContent = new TextDecoder().decode(fileContent);
    }

    // Close the connection
    await client.close();

    return xmlContent;
  } catch (error) {
    console.error("FTP error:", error);
    if (client.connected) {
      await client.close();
    }
    throw error;
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
      console.log("Fetching fresh properties from FTP...");
      
      try {
        const xmlContent = await fetchXMLFromFTP();
        if (xmlContent) {
          cachedProperties = parseXML(xmlContent);
          lastFetched = now;
          console.log(`Successfully fetched ${cachedProperties.length} properties`);
        }
      } catch (ftpError) {
        console.error("Failed to fetch from FTP:", ftpError);
        // If cache is empty, we have no fallback
        if (cachedProperties.length === 0) {
          throw new Error("Failed to fetch properties and no cache available");
        }
        // Otherwise use stale cache and log warning
        console.warn("Using stale cache due to FTP error");
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
