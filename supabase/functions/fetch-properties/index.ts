import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  // During development, use mock data instead of actual FTP connection
  // When in production, uncomment the FTP code below and replace with real credentials
  
  console.log("Using mock data instead of FTP connection for development");
  return getMockXMLData();
  
  /* 
  // Uncomment and update with real credentials for production
  const client = new FTPClient();
  let xmlContent = "";

  try {
    // FTP connection details - REPLACE WITH ACTUAL CREDENTIALS
    await client.connect({
      host: "ftp.example.com",  // Real FTP host
      port: 21,
      username: "realuser",     // Real username
      password: "realpassword"  // Real password
    });

    // Navigate to directory if needed
    // await client.cd("/path/to/directory");

    // Get file content as text - REPLACE WITH ACTUAL FILENAME
    const fileReader = await client.get("properties.xml");
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
  */
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
          cachedProperties = parseXML(xmlContent);
          lastFetched = now;
          console.log(`Successfully fetched ${cachedProperties.length} properties`);
        }
      } catch (ftpError) {
        console.error("Failed to fetch from FTP:", ftpError);
        // If cache is empty, use mock data as fallback
        if (cachedProperties.length === 0) {
          console.log("Using mock data as fallback");
          const mockXML = getMockXMLData();
          cachedProperties = parseXML(mockXML);
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
