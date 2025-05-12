
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useAcfProperties, NormalizedProperty } from "@/hooks/useAcfProperties";
import { Link } from "react-router-dom";

const PropertyCarouselACF = () => {
  // Fetch properties from ACF API
  const {
    data: properties,
    isLoading,
    error
  } = useAcfProperties();

  // Si aucun bien n'est trouvé ou en cours de chargement, afficher un message
  if (isLoading) {
    return <section className="container mx-auto mb-20 px-4 py-[20px] text-center">
        <h2 className="text-2xl font-serif text-[#C8A977] mb-4">Nos Biens Immobiliers</h2>
        <p className="text-[#37373A]">Chargement des biens immobiliers en cours...</p>
      </section>;
  }

  // Si une erreur s'est produite ou si aucun bien n'est trouvé
  if (error || !properties || properties.length === 0) {
    return <section className="container mx-auto mb-20 px-4 py-[20px] text-center">
        <h2 className="text-2xl font-serif text-[#C8A977] mb-4">Nos Biens Immobiliers</h2>
        <p className="text-[#37373A]">Biens immobiliers en cours de publication...</p>
      </section>;
  }

  // Conversion des prix en nombres pour le tri
  const getPropertyPrice = (property: NormalizedProperty): number => {
    const priceText = property.prix || "0";
    return parseInt(priceText.replace(/[^0-9]/g, ""), 10) || 0;
  };

  // Trier les propriétés du plus cher au moins cher
  const sortedProperties = [...properties].sort((a, b) => getPropertyPrice(b) - getPropertyPrice(a));

  return (
    <section className="container mx-auto mb-20 px-4 py-[20px]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-['FreightBig Pro', serif] text-[#C8A977] mb-4">Nos Biens d'Exception</h2>
        <p className="text-[#37373A] max-w-2xl mx-auto">Découvrez notre sélection de propriétés exclusives</p>
      </div>
      
      <Carousel className="mx-auto max-w-6xl" plugins={[AutoplayPlugin({
        delay: 4000,
        stopOnInteraction: true,
        stopOnMouseEnter: true
      })]} opts={{
        align: "start",
        loop: true
      }}>
        <div className="relative">
          <CarouselContent>
            {sortedProperties.map(property => (
              <CarouselItem key={property.id} className="md:basis-1/3 pl-4 animate-fadeIn">
                <Link to={`/property/${property.id}`} className="block h-full">
                  <div className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
                    <div className="p-0 relative">
                      <div className="relative">
                        <img 
                          src={property.image} 
                          alt={property.titre}
                          className="w-full h-56 object-cover" 
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                          }} 
                        />
                        <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 text-[10px] font-medium">
                          {property.reference}
                        </div>
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-[#C8A977]/90 text-white px-3 py-1 text-xs font-medium uppercase">
                          {property.titre.split(" ")[0] || "PROPRIÉTÉ"}
                        </div>
                      </div>

                      <div className="p-4 text-center">
                        <h3 className="text-lg font-['FreightBig Pro', serif] mt-2 text-[#C8A977]">
                          {property.titre}
                        </h3>
                        <p className="text-sm text-gray-600">{property.ville}</p>
                        <p className="font-semibold text-lg mb-2 text-[#B17226]">
                          {property.prix}
                        </p>

                        <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-2">
                          <div className="flex flex-col items-center">
                            <p className="text-[10px] text-gray-600">Surface</p>
                            <p className="font-medium text-sm">
                              {property.surface || "NC"}
                            </p>
                          </div>
                          <div className="flex flex-col items-center border-l border-r border-gray-200">
                            <p className="text-[10px] text-gray-600">Pièces</p>
                            <p className="font-medium text-sm">
                              {property.pieces || "NC"}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="text-[10px] text-gray-600">Chambres</p>
                            <p className="font-medium text-sm">
                              {property.chambres || "NC"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
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

export default PropertyCarouselACF;
