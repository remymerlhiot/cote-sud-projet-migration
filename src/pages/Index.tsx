import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import ServiceSection from "@/components/ServiceSection";
import { Accordion } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useWordPress";
import { useAccueilPage } from "@/hooks/useAccueilPage";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import WordPressPage from "@/components/WordPressPage";
import "@/styles/elementor.css"; // Import the Elementor CSS fixes

const Index = () => {
  // Fetch homepage content from WordPress API
  const { data: pageData, isLoading: pageLoading, isError: pageError } = useAccueilPage();
  
  // Fetch properties from WordPress API
  const { data: wpProperties, isLoading, error } = useProperties();
  
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
  
  if (pageError) {
    toast.error("Impossible de récupérer le contenu de la page d'accueil. Affichage des données de secours.");
  }

  // Use WordPress data if available, otherwise use fallback
  const displayProperties = wpProperties && wpProperties.length > 0 ? wpProperties : fallbackProperties;

  // Default content if no WordPress content is available
  const fallbackTitle = "L'IMMOBILIER DE PRESTIGE";
  const fallbackSubtitle = "NOS BIENS À LA VENTE";
  
  const services = [
    {
      id: "estimation",
      title: "L'ESTIMATION",
      content: "Nous prenons un soin particulier à étudier et déterminer la valeur précise de votre bien grâce à notre expertise immobilière sur différents critères méthodologiquement explorés, afin de définir le juste prix du bien."
    },
    {
      id: "diffusion",
      title: "UNE DIFFUSION CIBLE",
      content: ""
    },
    {
      id: "offre",
      title: "L'OFFRE D'ACHAT",
      content: ""
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Prestige Title - Using WordPress Content or Fallback */}
        <section className="text-center py-12">
          {pageLoading ? (
            <div className="space-y-4 max-w-md mx-auto">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-2/4 mx-auto" />
            </div>
          ) : (
            <>
              <h2 
                className="text-2xl md:text-3xl font-light text-[#CD9B59] mb-8"
                dangerouslySetInnerHTML={{ 
                  __html: pageData?.title?.rendered || fallbackTitle 
                }}
              />
              {!pageData && (
                <h3 className="text-xl md:text-2xl font-light text-[#CD9B59]">{fallbackSubtitle}</h3>
              )}
            </>
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

        {/* Services Section */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-[#CD9B59] text-center mb-12">SERVICES DE L'AGENCE</h2>
          
          <div className="relative">
            <div className="bg-cover bg-center h-[400px]" style={{ 
              backgroundImage: pageData?.featured_media_url 
                ? `url('${pageData.featured_media_url}')` 
                : "url('/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png')" 
            }}>
              <div className="container mx-auto px-4 h-full flex justify-end items-center">
                <div className="w-full md:w-1/2 lg:w-1/3">
                  <Accordion type="single" collapsible className="w-full">
                    {services.map((service) => (
                      <ServiceSection key={service.id} service={service} />
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Difference Section - Dynamic Content from WordPress with Elementor Cleanup */}
        <section className="container mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-[#CD9B59] text-center mb-12">LA DIFFÉRENCE</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 relative">
              <div className="rounded-full overflow-hidden">
                <img 
                  src={pageData?.featured_media_url || "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"} 
                  alt={pageData?.title?.rendered || "Différence AXO"} 
                  className="w-full" 
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3 text-[#CD9B59]">
              {pageLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-40 mt-6" />
                </div>
              ) : (
                <>
                  {pageData ? (
                    <div className="elementor-content">
                      <WordPressPage 
                        slug="new-home"
                        showTitle={false} 
                        className="prose max-w-none prose-headings:text-[#CD9B59] prose-headings:font-light text-[#CD9B59]"
                        cleaningOptions={{
                          removeElementorClasses: true,
                          simplifyStructure: true,
                          makeImagesResponsive: true,
                          fixLinks: true,
                        }}
                        extractSection=".elementor-widget-text-editor"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-light mb-4 text-center md:text-left">L'ACCOMPAGNEMENT</h3>
                      <p className="mb-6 text-center md:text-left">
                        Aujourd'hui, notre priorité est d'offrir un accompagnement sur-mesure et une expertise complète, tant sur le plan immobilier que sur le plan patrimonial, fiscal ou juridique.
                      </p>
                      <p className="mb-6 text-center md:text-left">
                        Nous nous engageons à fournir un service personnalisé, en collaboration avec des partenaires de confiance, pour chaque étape de votre projet immobilier, qu'il s'agisse d'achat ou de vente.
                      </p>
                      <p className="mb-8 text-center md:text-left">
                        Notaires, courtiers, architectes, maîtres d'œuvre, artisans ou encore spécialistes, concepteurs d'intérieur, transitaires, conseillers, diagnostiqueurs. Nos experts seront activés pour vous durant toute la chaîne de notre engagement à s'adapter à chacun de vos besoins.
                      </p>
                    </>
                  )}
                  
                  <div className="text-center md:text-left">
                    <Button className="bg-[#CD9B59] text-white hover:bg-[#b78a4d]">
                      EN SAVOIR PLUS
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
