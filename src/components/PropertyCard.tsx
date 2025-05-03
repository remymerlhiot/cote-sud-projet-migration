
import { Card, CardContent } from "@/components/ui/card";
import { WordPressProperty, transformPropertyData } from "@/services/wordpressApi";
import { Link } from "react-router-dom";

type PropertyProps = {
  property: WordPressProperty | {
    id: number;
    title: string;
    location: string;
    ref: string;
    price: string;
    area: string;
    rooms: string;
    bedrooms: string;
    image: string;
    description?: string;
    dpe?: string;
  }
};

// Define a type for our transformed display data
type DisplayProperty = {
  id: number;
  title: string | { rendered: string };
  location: string;
  ref: string;
  price: string;
  priceNumber?: number;
  area: string;
  rooms: string;
  bedrooms: string;
  image: string;
  date?: string;
  description?: string;
  dpe?: string;
};

const PropertyCard = ({ property }: PropertyProps) => {
  // Always transform the data to ensure consistent structure
  const displayData: DisplayProperty = 'acf' in property 
    ? transformPropertyData(property as WordPressProperty) 
    : property as DisplayProperty;

  // Helper function to determine the color class based on DPE rating
  const getDpeColorClass = (dpe?: string) => {
    if (!dpe) return "bg-gray-200";
    
    switch(dpe.toUpperCase()) {
      case "A": return "bg-green-500";
      case "B": return "bg-green-400";
      case "C": return "bg-yellow-300";
      case "D": return "bg-yellow-500";
      case "E": return "bg-orange-500";
      case "F": return "bg-red-500";
      case "G": return "bg-red-700";
      default: return "bg-gray-200";
    }
  };

  return (
    <Link to={`/property/${displayData.id}`} className="block h-full">
      <Card className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0 relative">
          <div>
            <img 
              src={displayData.image} 
              alt={typeof displayData.title === 'string' ? displayData.title : "Propriété"} 
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 text-[10px] font-medium">
              {displayData.ref}
            </div>
            {displayData.dpe && (
              <div className={`absolute top-3 right-3 ${getDpeColorClass(displayData.dpe)} text-white px-2 py-1 text-xs font-medium rounded-sm`}>
                DPE: {displayData.dpe.toUpperCase()}
              </div>
            )}
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-medium mt-2 text-[#CD9B59]">
              {typeof displayData.title === 'string' ? displayData.title : displayData.title.rendered}
            </h3>
            <p className="text-xs text-gray-600 mb-2 uppercase">{displayData.location}</p>
            <p className="font-semibold text-lg mb-4">PRIX : {displayData.price}</p>

            <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 mb-4">
              <div className="flex flex-col items-center">
                <p className="text-[10px] text-gray-600">Surface</p>
                <p className="font-medium text-sm">{displayData.area}</p>
              </div>
              <div className="flex flex-col items-center border-l border-r border-gray-200">
                <p className="text-[10px] text-gray-600">Pièces</p>
                <p className="font-medium text-sm">{displayData.rooms}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] text-gray-600">Chambres</p>
                <p className="font-medium text-sm">{displayData.bedrooms}</p>
              </div>
            </div>
            
            {displayData.description && (
              <div className="text-left border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-700 line-clamp-3">{displayData.description}</p>
              </div>
            )}
            
            <div className="mt-4 flex justify-center">
              <span className="inline-block px-4 py-2 bg-[#CD9B59] text-white text-xs rounded-sm hover:bg-[#BA8A48] transition-colors">
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
