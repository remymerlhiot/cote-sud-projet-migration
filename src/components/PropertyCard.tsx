
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type PropertyProps = {
  property: {
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
  return (
    <Card className="overflow-hidden border-none shadow-lg h-full">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-white px-2 py-1 text-xs font-semibold">
            {property.ref}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-center">{property.title}</h3>
          <p className="text-center text-sm text-gray-600 mb-2">{property.location}</p>
          <p className="text-center font-semibold text-[#CD9B59]">PRIX : {property.price}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-4 py-2 bg-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-xs">🏠</span>
          <span className="text-xs">{property.area}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">🚪</span>
          <span className="text-xs">{property.rooms}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">🛏️</span>
          <span className="text-xs">{property.bedrooms}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
