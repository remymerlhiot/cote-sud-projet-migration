
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PropertyCard from "@/components/PropertyCard";
import { useState } from "react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useProperties, TransformedProperty } from "@/hooks/useProperties";
import { toast } from "@/components/ui/sonner";

const PropertyCarousel = () => {
  // Fetch properties from our FTP service
  const {
    data: properties,
    isLoading,
    error
  } = useProperties();

  // Fallback data if the API call fails or is loading
  const [fallbackProperties] = useState<TransformedProperty[]>([{
    id: 1,
    title: "APPARTEMENT",
    location: "SAINT PONT L'ESPRIT",
    ref: "REF N° 20345",
    price: "642 500 €",
    priceNumber: 642500,
    area: "248m²",
    rooms: "7",
    bedrooms: "3",
    image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
    propertyType: "APPARTEMENT",
    date: new Date().toISOString(),
    description: "",
    fullContent: "",
    constructionYear: "",
    hasBalcony: false,
    hasElevator: false,
    hasTerrasse: false,
    hasPool: false,
    garageCount: "0",
    dpe: ""
  }, {
    id: 2,
    title: "DUPLEX",
    location: "SAINT REMY DE PROVENCE",
    ref: "REF N° 20340",
    price: "1 687 000 €",
    priceNumber: 1687000,
    area: "176m²",
    rooms: "6",
    bedrooms: "4",
    image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
    propertyType: "DUPLEX",
    date: new Date().toISOString(),
    description: "",
    fullContent: "",
    constructionYear: "",
    hasBalcony: false,
    hasElevator: false,
    hasTerrasse: false,
    hasPool: false,
    garageCount: "0",
    dpe: ""
  }, {
    id: 3,
    title: "MAISON",
    location: "EYGALIÈRES",
    ref: "REF N° 21155",
    price: "793 000 €",
    priceNumber: 793000,
    area: "117m²",
    rooms: "4",
    bedrooms: "3",
    image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
    propertyType: "MAISON",
    date: new Date().toISOString(),
    description: "",
    fullContent: "",
    constructionYear: "",
    hasBalcony: false,
    hasElevator: false,
    hasTerrasse: false,
    hasPool: false,
    garageCount: "0",
    dpe: ""
  }]);

  // Show toast error if API fails
  if (error) {
    toast.error("Impossible de récupérer les biens immobiliers. Affichage des données de secours.");
  }

  // Get properties to display (real or fallback) - already sorted by price (highest to lowest) from the useProperties hook
  const displayProperties = properties && properties.length > 0 ? properties : fallbackProperties;
  
  return (
    <section className="container mx-auto mb-20 px-4 py-[20px]">
      <Carousel 
        className="mx-auto max-w-6xl" 
        plugins={[AutoplayPlugin({
          delay: 4000,
          stopOnInteraction: true,
          stopOnMouseEnter: true
        })]} 
        opts={{
          align: "start",
          loop: true
        }}
      >
        <div className="relative">
          <CarouselContent>
            {displayProperties.length > 0 ? (
              displayProperties.map(property => (
                <CarouselItem key={property.id} className="md:basis-1/3 pl-4 animate-fadeIn">
                  <PropertyCard property={property} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="basis-full pl-4">
                <div className="text-center p-12 bg-white rounded shadow">
                  <p>Aucun bien immobilier disponible pour le moment.</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
            <CarouselPrevious className="relative static transform-none h-8 w-8 border-[#CD9B59] bg-white text-[#CD9B59] hover:bg-[#CD9B59] hover:text-white" />
          </div>
          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
            <CarouselNext className="relative static transform-none h-8 w-8 border-[#CD9B59] bg-white text-[#CD9B59] hover:bg-[#CD9B59] hover:text-white" />
          </div>
        </div>
      </Carousel>
    </section>
  );
};

export default PropertyCarousel;
