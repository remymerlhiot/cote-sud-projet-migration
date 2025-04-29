
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WordPressProperty } from "@/services/wordpressApi";
import { transformPropertyData } from "@/hooks/useWordPress";

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

const PropertyCard = ({ property }: PropertyProps) => {
  // Handle both WordPress API data and our static data format
  const isWordPressData = 'title' in property && typeof property.title === 'object';
  
  const displayData = isWordPressData 
    ? transformPropertyData(property as WordPressProperty) 
    : property;

  return (
    <Card className="overflow-hidden border-none shadow-lg h-full">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={displayData.image} 
            alt={typeof displayData.title === 'string' ? displayData.title : "Propriété"} 
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-white px-2 py-1 text-xs font-semibold">
            {displayData.ref}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-center">
            {typeof displayData.title === 'string' ? displayData.title : displayData.title.rendered}
          </h3>
          <p className="text-center text-sm text-gray-600 mb-2">{displayData.location}</p>
          <p className="text-center font-semibold text-[#CD9B59]">PRIX : {displayData.price}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-4 py-2 bg-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs">🏠</span>
          <span className="text-xs">{displayData.area}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">🚪</span>
          <span className="text-xs">{displayData.rooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">🛏️</span>
          <span className="text-xs">{displayData.bedrooms}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
