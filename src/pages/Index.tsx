
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProperties, transformPropertyData } from "@/hooks/useWordPress";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { useCustomPage } from "@/hooks/useCustomPage";
import { ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  // Fetch properties from WordPress API
  const { data: wpProperties, isLoading, error } = useProperties();
  
  // Fallback data if the API call fails or is loading
  const [fallbackProperties] = useState([
    {
      id: 1,
      title: "APPARTEMENT",
      location: "SAINT PONT L'ESPRIT",
      ref: "REF N° 20345",
      price: "642 500 €",
      area: "248m²",
      rooms: "7",
      bedrooms: "3",
      image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"
    },
    {
      id: 2,
      title: "DUPLEX",
      location: "SAINT REMY DE PROVENCE",
      ref: "REF N° 20340",
      price: "1 687 000 €",
      area: "176m²",
      rooms: "6",
      bedrooms: "4",
      image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"
    },
    {
      id: 3,
      title: "MAISON",
      location: "EYGALIÈRES",
      ref: "REF N° 21155",
      price: "793 000 €",
      area: "117m²",
      rooms: "4",
      bedrooms: "3",
      image: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"
    }
  ]);

  // Fetch homepage content
  const { data: homePage } = useCustomPage("new-home");
  
  // Show toast error if API fails
  if (error) {
    toast.error("Impossible de récupérer les biens immobiliers. Affichage des données de secours.");
  }

  // Transform and sort properties by date (most recent first)
  const displayProperties = wpProperties && wpProperties.length > 0 
    ? wpProperties.map(prop => transformPropertyData(prop))
        .sort((a, b) => {
          // Sort by date (newest first)
          const dateA = new Date(a.date || "");
          const dateB = new Date(b.date || "");
          return dateB.getTime() - dateA.getTime();
        })
    : fallbackProperties;

  return (
    <div className="flex flex-col min-h-screen bg-cream font-raleway">
      {/* Header - Hero Section */}
      <div className="relative">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Main Prestige Title */}
        <section className="text-center py-20 px-4 bg-cream">
          <h1 className="text-3xl md:text-4xl font-playfair font-normal text-[#CD9B59] mb-5">
            L'IMMOBILIER DE PRESTIGE
          </h1>
          <h2 className="text-xl md:text-2xl font-playfair font-normal text-[#CD9B59] mt-10 mb-12">
            NOS BIENS À LA VENTE
          </h2>
        </section>

        {/* Properties Carousel */}
        <section className="container mx-auto mb-20 px-4">
          <Carousel 
            className="mx-auto max-w-6xl"
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <div className="relative">
              <CarouselContent>
                {displayProperties.length > 0 ? (
                  displayProperties.map((property) => (
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

        {/* Services de l'Agence Section */}
        <section className="relative mb-20">
          <div className="w-full h-[600px] bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png')" }}>
            <div className="absolute inset-0 bg-black/60">
              <div className="container mx-auto h-full flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 text-center md:text-left p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-playfair font-normal text-[#CD9B59] mb-6">
                    SERVICES DE L'AGENCE
                  </h2>
                </div>
                <div className="md:w-2/3 p-8 md:p-12">
                  <div className="space-y-8">
                    <div className="border-b border-[#CD9B59]/30 pb-4">
                      <h3 className="text-xl font-playfair font-normal text-[#CD9B59] mb-2">L'ESTIMATION</h3>
                      <p className="text-white text-sm">
                        Nous réalisons un rapport détaillé du bien et déterminons sa valeur après une analyse géographique et de marché pour optimiser le prix de vente et obtenir le prix juste du bien.
                      </p>
                    </div>
                    <div className="border-b border-[#CD9B59]/30 pb-4">
                      <h3 className="text-xl font-playfair font-normal text-[#CD9B59] mb-2">UNE DIFFUSION CIBLÉE</h3>
                    </div>
                    <div>
                      <h3 className="text-xl font-playfair font-normal text-[#CD9B59] mb-2">L'OFFRE D'ACHAT</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Différence & Accompagnement Section */}
        <section className="container mx-auto mb-20 px-4">
          <h2 className="text-2xl md:text-3xl font-playfair font-normal text-[#CD9B59] text-center mb-12">
            LA DIFFÉRENCE
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="md:w-1/3">
              <div className="overflow-hidden rounded-full">
                <img 
                  src={homePage?.featured_image || "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png"}
                  alt="AXO Côté Sud - La différence" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-gray-700 mb-4">
                AXO Côté Sud, réseau d'agences spécialisées en commercialisation de biens immobiliers d'exception, s'adresse aux clients à la recherche de leur lieu de vie idéal au cœur du Sud de la France.
              </p>
              <p className="text-gray-700 mb-8">
                Notre équipe composée d'experts du secteur immobilier, vous accompagne tout au long de votre projet, des premières étapes de recherche jusqu'à la concrétisation de votre projet immobilier que vous souhaitiez devenir locataire ou bien propriétaire.
              </p>
              
              <h3 className="text-2xl font-playfair font-normal text-[#CD9B59] mb-6">
                L'ACCOMPAGNEMENT
              </h3>
              
              <p className="text-gray-700 mb-6">
                Anticipation, des actions, des prestations, maîtrise des dossiers, professionnalisme, des connaissances, disponibilité et réactivité. Autant d'adjectifs qui vous permettront de vous rassurer dans votre projet, d'avoir une écoute face à vos questionnements, de recevoir des conseils avisés et d'être soutenu dans vos démarches.
              </p>
              
              <Button variant="outline" className="border-[#CD9B59] text-[#CD9B59] hover:bg-[#CD9B59] hover:text-white">
                EN SAVOIR PLUS <ChevronRight size={16} />
              </Button>
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
