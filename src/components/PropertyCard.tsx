
import { Card, CardContent } from "@/components/ui/card";
import { TransformedProperty } from "@/hooks/useProperties";
import { Link } from "react-router-dom";

type PropertyProps = {
  property: TransformedProperty;
};

// Affiche "NC" si la valeur est vide
const displayValue = (v?: string) => (v && v !== "" ? v : "NC");

/**
 * Extrait le nom du négociateur en supprimant "L'Agence immobilière de prestige Côté Sud" 
 * et autres variations similaires
 */
const extractNegotiatorName = (fullName?: string): string => {
  if (!fullName) return "";
  
  // Remplacer différentes formes d'apostrophes encodées
  const cleanName = fullName
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
  
  // Supprimer l'agence et autres textes non pertinents
  const agencyVariants = [
    /L['']Agence immobilière de prestige Côté Sud/i,
    /L['']Agence Côté Sud/i,
    /Agence Côté Sud/i,
    /Côté Sud/i
  ];
  
  let result = cleanName;
  for (const variant of agencyVariants) {
    result = result.replace(variant, "").trim();
  }
  
  // Supprimer les tirets ou traits d'union en début/fin
  result = result.replace(/^[-–—]+|[-–—]+$/g, "").trim();
  
  return result;
};

const PropertyCard = ({ property }: PropertyProps) => {
  const displayImage = property.image;
  
  // Type affiché
  const displayType =
    property.propertyType ||
    property.title?.split(" ")[0] ||
    "PROPRIÉTÉ";

  const renderFeatureBadges = () => {
    const badges = [];
    if (property.isNewConstruction) {
      badges.push(
        <span
          key="new"
          className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-sm z-10"
        >
          NEUF
        </span>
      );
    }
    if (property.isPrestigious) {
      badges.push(
        <span
          key="prestige"
          className="absolute top-3 right-16 bg-[#B17226] text-white px-2 py-1 text-xs font-medium rounded-sm z-10"
        >
          PRESTIGE
        </span>
      );
    }
    if (property.isViager) {
      badges.push(
        <span
          key="viager"
          className="absolute top-3 left-24 bg-purple-500 text-white px-2 py-1 text-xs font-medium rounded-sm z-10"
        >
          VIAGER
        </span>
      );
    }
    return badges;
  };

  return (
    <Link to={`/property/${property.id}`} className="block h-full">
      <Card className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0 relative">
          <div className="relative">
            <img
              src={displayImage}
              alt={property.title}
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 text-[10px] font-medium">
              {property.ref}
            </div>
            {displayType && (
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-[#C8A977]/90 text-white px-3 py-1 text-xs font-medium uppercase">
                {displayType}
              </div>
            )}
            {renderFeatureBadges()}
          </div>

          <div className="p-4 text-center">
            <h3 className="text-lg font-serif mt-2 text-[#C8A977]">
              {property.title}
            </h3>

            <p className="font-semibold text-lg mb-4 text-[#B17226]">
              {property.price}
            </p>

            <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 mb-4">
              <div className="flex flex-col items-center">
                <p className="text-[10px] text-gray-600">Surface</p>
                <p className="font-medium text-sm">
                  {displayValue(property.area)}
                </p>
              </div>
              <div className="flex flex-col items-center border-l border-r border-gray-200">
                <p className="text-[10px] text-gray-600">Pièces</p>
                <p className="font-medium text-sm">
                  {displayValue(property.rooms)}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] text-gray-600">Chambres</p>
                <p className="font-medium text-sm">
                  {displayValue(property.bedrooms)}
                </p>
              </div>
            </div>

            {/* Agent name display section has been removed as requested */}

            {(property.hasBalcony ||
              property.hasTerrasse ||
              property.hasPool ||
              (property.garageCount || "") !== "" ||
              property.bathrooms) && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {property.hasBalcony && (
                  <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                    Balcon
                  </span>
                )}
                {property.hasTerrasse && (
                  <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                    Terrasse
                  </span>
                )}
                {property.hasPool && (
                  <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                    Piscine
                  </span>
                )}
                {property.garageCount && (
                  <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                    {parseInt(property.garageCount) > 1
                      ? `${property.garageCount} Garages`
                      : "Garage"}
                  </span>
                )}
                {property.bathrooms && (
                  <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                    {parseInt(property.bathrooms) > 1
                      ? `${property.bathrooms} SDB`
                      : "1 SDB"}
                  </span>
                )}
                {property.isFurnished && (
                  <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                    Meublé
                  </span>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <span className="inline-block px-4 py-2 bg-[#C8A977] text-white text-xs rounded-sm hover:bg-[#B17226] transition-colors">
                Voir le détail
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
