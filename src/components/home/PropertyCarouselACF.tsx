
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState } from "react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useAcfProperties, NormalizedProperty } from "@/hooks/useAcfProperties";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

const PropertyCarouselACF = () => {
  // Fetch properties from ACF API
  const {
    data: properties,
    isLoading,
    error
  } = useAcfProperties();

  // Fallback data if the API call fails or is loading
  const [fallbackProperties] = useState<NormalizedProperty[]>([{
    id: 1,
    titre: "APPARTEMENT",
    ville: "SAINT PONT L'ESPRIT",
    reference: "REF N° 20345",
    prix: "642 500 €",
    surface: "248m²",
    pieces: "7",
    chambres: "3",
    image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
    allImages: ["/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"],
    description: "Belle appartement avec vue dégagée",
    date: new Date().toISOString()
  }, {
    id: 2,
    titre: "DUPLEX",
    ville: "SAINT REMY DE PROVENCE",
    reference: "REF N° 20340",
    prix: "1 687 000 €",
    surface: "176m²",
    pieces: "6",
    chambres: "4",
    image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
    allImages: ["/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"],
    description: "Magnifique duplex au cœur de Saint-Rémy",
    date: new Date().toISOString()
  }, {
    id: 3,
    titre: "MAISON",
    ville: "EYGALIÈRES",
    reference: "REF N° 21155",
    prix: "793 000 €",
    surface: "117m²",
    pieces: "4",
    chambres: "3",
    image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
    allImages: ["/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"],
    description: "Jolie maison avec jardin arboré",
    date: new Date().toISOString()
  }]);

  // Show toast error if API fails
  if (error) {
    toast.error("Impossible de récupérer les biens immobiliers. Affichage des données de secours.");
  }

  // Get properties to display (real or fallback) - sorted by date (newest first)
  const displayProperties = properties && properties.length > 0 
    ? properties.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
    : fallbackProperties;
  
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
                  <Link to={`/property/${property.id}`} className="block h-full">
                    <div className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
                      <div className="p-0 relative">
                        <div className="relative">
                          <img
                            src={property.image}
                            alt={property.titre}
                            className="w-full h-56 object-cover"
                            onError={(e) => {
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
                          <h3 className="text-lg font-serif mt-2 text-[#C8A977]">
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

export default PropertyCarouselACF;
