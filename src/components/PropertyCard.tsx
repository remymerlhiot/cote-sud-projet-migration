import { Card, CardContent } from "@/components/ui/card";
import { NormalizedProperty } from "@/types";
import { Link } from "react-router-dom";

type PropertyProps = {
  property: NormalizedProperty;
};

// Affiche "NC" si la valeur est vide
const displayValue = (v?: string) => (v && v !== "" ? v : "NC");

const extractNegotiatorName = (fullName?: string): string => {
  if (!fullName) return "";

  const cleanName = fullName
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");

  const agencyVariants = [
    /L[\'’`]Agence immobilière de prestige Côté Sud/i,
    /L[\'’`]Agence Côté Sud/i,
    /Agence Côté Sud/i,
    /Côté Sud/i
  ];

  let result = cleanName;
  for (const variant of agencyVariants) {
    result = result.replace(variant, "").trim();
  }

  result = result.replace(/^[-–—]+|[-–—]+$/g, "").trim();

  return result;
};

const PropertyCard = ({ property }: PropertyProps) => {
  // Use property.image for the main display image
  const displayImage = property.image || "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";

  const displayType =
    property.propertyType || property.titre?.split(" ")[0] || "PROPRIÉTÉ";

  const renderFeatureBadges = () => {
    const badges = [];
    if (property.isNewConstruction) {
      badges.push(
        <span key="new" className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-sm z-10">
          NEUF
        </span>
      );
    }
    if (property.isPrestigious) {
      badges.push(
        <span key="prestige" className="absolute top-3 right-16 bg-[#B17226] text-white px-2 py-1 text-xs font-medium rounded-sm z-10">
          PRESTIGE
        </span>
      );
    }
    if (property.isViager) {
      badges.push(
        <span key="viager" className="absolute top-3 left-24 bg-purple-500 text-white px-2 py-1 text-xs font-medium rounded-sm z-10">
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
              alt={property.titre}
              className="w-full h-56 object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
              }}
            />
            {renderFeatureBadges()}
          </div>
        </CardContent>

        <div className="p-4 space-y-2">
          <h2 className="text-md font-semibold text-gray-800">{property.titre}</h2>
          <p className="text-sm text-gray-500">{displayValue(property.ville)}</p>
          <p className="text-lg font-bold text-[#B17226]">
            {displayValue(property.prix)} €
          </p>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Surface {displayValue(property.surface)} m²</span>
            {/* Assuming nbPieces and nbChambres were typos and should be pieces and chambres */}
            <span>Pièces {displayValue(property.pieces)}</span>
            <span>Chambres {displayValue(property.chambres)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;
