import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { TransformedProperty } from "./wordpress/types";

export interface FTPProperty {
  id: string;
  reference: string;
  type: string;
  title: string;
  description: string;
  price: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  surface: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  constructionYear: string;
  features: {
    hasBalcony: boolean;
    hasPool: boolean;
    hasElevator: boolean;
    hasGarage: boolean;
    hasTerrasse: boolean;
  };
  photos: string[];
  dpe: string;
}

const FALLBACK_IMAGE = "/lovable-uploads/fallback.png";

export const fetchProperties = async (): Promise<FTPProperty[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-properties");
    if (error) throw new Error(error.message);
    if (data?.properties?.length) {
      console.log("FTP API Complete Property Response:", data.properties[0]);
    }
    return (data.properties || []).sort((a, b) => {
      const pa = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
      const pb = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
      return pb - pa;
    });
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    toast.error("Impossible de récupérer les biens");
    return [];
  }
};

export const transformFTPPropertyData = (ftp: FTPProperty): TransformedProperty => {
  const numPrice = parseInt(ftp.price.replace(/[^0-9]/g, "")) || 0;
  const formattedPrice = numPrice
    ? numPrice.toLocaleString("fr-FR") + " €"
    : "Prix sur demande";

  // Debug champs manquants
  if (!ftp.surface || !ftp.rooms) {
    console.warn(`[FTP] Champs manquants pour ID ${ftp.id}`, {
      surface: ftp.surface,
      rooms: ftp.rooms,
    });
  }

  return {
    id: parseInt(ftp.id) || 0,
    title: ftp.type || ftp.title || "Propriété",
    location: ftp.city || "",
    ref: ftp.reference || `REF ${ftp.id}`,
    price: formattedPrice,
    priceNumber: numPrice,
    area: ftp.surface ? `${ftp.surface}m²` : "",
    rooms: ftp.rooms || "",
    bedrooms: ftp.bedrooms || "",
    image: ftp.photos[0] || FALLBACK_IMAGE,
    allImages: ftp.photos,
    date: new Date().toISOString(),
    description: ftp.description || "",
    fullContent: ftp.description || "",
    propertyType: ftp.type || "",
    constructionYear: ftp.constructionYear || "",
    hasBalcony: ftp.features.hasBalcony,
    hasElevator: ftp.features.hasElevator,
    hasTerrasse: ftp.features.hasTerrasse,
    hasPool: ftp.features.hasPool,
    garageCount: ftp.features.hasGarage ? "1" : "",
    dpe: ftp.dpe || "",
    postalCode: ftp.postalCode || "",
    address: ftp.address || "",
    bathrooms: ftp.bathrooms || "",
    country: ftp.country || "France",
    landArea: "",
    floorNumber: "",
    totalFloors: "",
    toilets: "",
    heatingType: "",
    isNewConstruction: false,
    isPrestigious: numPrice > 1_000_000,
    isFurnished: false,
    isViager: false,
    dpeGes: "",
    dpeValue: "",
    dpeGesValue: "",
    dpeDate: "",
    negotiatorName: "",
    negotiatorPhone: "",
    negotiatorEmail: "",
    negotiatorPhoto: "",
    negotiatorCity: "",
    negotiatorPostalCode: "",
  };
};
