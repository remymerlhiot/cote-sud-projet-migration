
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import ServiceSection from "@/components/ServiceSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProperties, transformPropertyData } from "@/hooks/useWordPress";
import { useAccueilPage } from "@/hooks/useAccueilPage";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import WordPressPage from "@/components/WordPressPage";

const Index = () => {
  // Fetch properties from WordPress API
  const { data: wpProperties, isLoading, error } = useProperties();
  
  // Fetch home page content
  const { data: homePage, isLoading: isLoadingHome, error: homeError } = useAccueilPage();
  
  // Fallback data if the API call fails or is loading
  const [fallbackProperties] = useState([
    {
      id: 1,
      title: "MAISON DE VILLAGE",
      location: "BOULBON",
      ref: "REF 42-12704",
      price: "199 000 €",
      area: "274m²",
      rooms: "10",
      bedrooms: "5",
      image: "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"
    },
    {
      id: 2,
      title: "MAISON INDIVIDUELLE",
      location: "TRIGNAN",
      ref: "REF 42-12736",
      price: "269 000 €",
      area: "135m²",
      rooms: "5",
      bedrooms: "3",
      image: "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"
    },
    {
      id: 3,
      title: "MAISON",
      location: "EYMEUX",
      ref: "REF 42-12785",
      price: "495 000 €",
      area: "180m²",
      rooms: "6",
      bedrooms: "4",
      image: "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"
    }
  ]);
  
  // Show toast error if API fails
  if (error) {
    toast.error("Impossible de récupérer les biens immobiliers. Affichage des données de secours.");
  }

  if (homeError) {
    toast.error("Impossible de récupérer le contenu de la page d'accueil.");
  }

  // Use WordPress data if available, otherwise use fallback
  const displayProperties = wpProperties && wpProperties.length > 0 
    ? wpProperties.map(prop => transformPropertyData(prop))
    : fallbackProperties;

  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Prestige Title - WordPress Content */}
        <section className="text-center py-12">
          {isLoadingHome ? (
            <div className="mx-auto w-3/4 md:w-1/2">
              <Skeleton className="h-24 rounded-lg" />
            </div>
          ) : (
            <WordPressPage 
              slug="accueil" 
              showTitle={false}
              extractSection=".prestige-title"
              className="mx-auto w-3/4 md:w-1/2"
            />
          )}
        </section>

        {/* Properties Carousel */}
        <section className="container mx-auto mb-20">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-[#CD9B59]">Chargement des biens immobiliers...</p>
            </div>
          ) : (
            <Carousel className="mx-auto max-w-6xl">
              <CarouselContent>
                {displayProperties.map((property) => (
                  <CarouselItem key={property.id} className="md:basis-1/3">
                    <PropertyCard property={property} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static transform-none h-8 w-8 mr-2" />
                <CarouselNext className="relative static transform-none h-8 w-8" />
              </div>
            </Carousel>
          )}
        </section>

        {/* Services Section with Accordion */}
        <ServiceSection />

        {/* Difference Section - WordPress Content */}
        <section className="container mx-auto mb-20">
          {isLoadingHome ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3 mx-auto" />
              <div className="flex flex-col md:flex-row gap-8">
                <Skeleton className="w-full md:w-1/3 aspect-square rounded-full" />
                <Skeleton className="w-full md:w-2/3 h-64" />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-light text-[#CD9B59] text-center mb-12">
                LA DIFFÉRENCE
              </h2>
              
              <WordPressPage 
                slug="accueil" 
                showTitle={false}
                extractSection=".difference-section"
                className="flex flex-col md:flex-row items-center gap-8"
              />
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
