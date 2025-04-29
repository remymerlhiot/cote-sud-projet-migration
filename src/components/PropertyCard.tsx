
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WordPressProperty, transformPropertyData } from "@/services/wordpressApi";

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
  }
};

// Define a type for our transformed display data
type DisplayProperty = {
  id: number;
  title: string | { rendered: string };
  location: string;
  ref: string;
  price: string;
  area: string;
  rooms: string;
  bedrooms: string;
  image: string;
};

const PropertyCard = ({ property }: PropertyProps) => {
  // Always transform the data to ensure consistent structure
  const displayData: DisplayProperty = 'acf' in property 
    ? transformPropertyData(property as WordPressProperty) 
    : property as DisplayProperty;

  return (
    <Card className="overflow-hidden border-none shadow-md h-full bg-white">
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
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium mt-2 text-[#CD9B59]">
            {typeof displayData.title === 'string' ? displayData.title : displayData.title.rendered}
          </h3>
          <p className="text-xs text-gray-600 mb-4 uppercase">{displayData.location}</p>
          <p className="font-semibold text-lg mb-4">PRIX : {displayData.price}</p>

          <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
