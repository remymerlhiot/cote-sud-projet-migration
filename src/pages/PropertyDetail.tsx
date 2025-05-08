
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePropertyById, getValidImageUrl } from "@/hooks/useProperties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? id : "0";

  // State for tracking current photo in gallery
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fetch property details using our new hook
  const { data: displayData, isLoading, error } = usePropertyById(propertyId);

  // Helper function to determine the color class based on DPE rating
  const getDpeColorClass = (dpe?: string) => {
    if (!dpe) return "bg-gray-200 text-gray-800";
    
    switch(dpe.toUpperCase()) {
      case "A": return "bg-green-500 text-white";
      case "B": return "bg-green-400 text-white";
      case "C": return "bg-yellow-300 text-gray-800";
      case "D": return "bg-yellow-500 text-white";
      case "E": return "bg-orange-500 text-white";
      case "F": return "bg-red-500 text-white";
      case "G": return "bg-red-700 text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-cream font-raleway">
        <Header />
        <main className="container mx-auto py-12 px-4 flex-grow">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-32 w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !displayData) {
    return (
      <div className="flex flex-col min-h-screen bg-cream font-raleway">
        <Header />
        <main className="container mx-auto py-12 px-4 flex-grow">
          <div className="text-center py-12">
            <h2 className="text-2xl font-playfair text-[#CD9B59] mb-4">
              Bien non trouvé
            </h2>
            <p className="mb-6">Impossible de charger les informations de ce bien immobilier.</p>
            <Button asChild>
              <Link to="/nos-biens" className="inline-flex items-center">
                <ChevronLeft size={16} className="mr-2" /> Retourner à la liste des biens
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get all property images - fallback to an array with just the main image if allImages doesn't exist
  const propertyImages = displayData.allImages?.length ? displayData.allImages : [displayData.image];

  return (
    <div className="flex flex-col min-h-screen bg-cream font-raleway">
      <Header />
      
      <main className="container mx-auto py-12 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="outline" asChild className="border-[#CD9B59] text-[#CD9B59] hover:bg-[#CD9B59] hover:text-white">
              <Link to="/nos-biens" className="inline-flex items-center">
                <ChevronLeft size={16} className="mr-2" /> Retour aux biens
              </Link>
            </Button>
          </div>
          
          {/* Property title */}
          <h1 className="text-3xl md:text-4xl font-playfair text-[#CD9B59] mb-6">
            {displayData.title}
          </h1>
          
          {/* Property image gallery */}
          <div className="mb-8 relative">
            {propertyImages.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {propertyImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video w-full">
                        <img 
                          src={image} 
                          alt={`${displayData.title} - Vue ${index + 1}`} 
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            // Replace broken images with fallback
                            e.currentTarget.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-[#CD9B59] border-[#CD9B59]" />
                <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-[#CD9B59] border-[#CD9B59]" />
              </Carousel>
            ) : (
              <img 
                src={displayData.image} 
                alt={displayData.title} 
                className="w-full h-auto object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                }}
              />
            )}
            
            {/* Price badge */}
            <div className="absolute top-4 right-4 bg-[#B17226] text-white px-4 py-2 rounded-md text-lg font-semibold">
              {displayData.price}
            </div>
          </div>
          
          {/* Property quick info */}
          <Card className="mb-8 border-none shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Référence</p>
                  <p className="font-medium">{displayData.ref}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{displayData.propertyType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-medium">{displayData.location}</p>
                  {displayData.postalCode && <p className="text-xs text-gray-500">{displayData.postalCode}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Surface</p>
                  <p className="font-medium">{displayData.area}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Property features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600">Pièces</p>
                <p className="font-bold text-xl">{displayData.rooms}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600">Chambres</p>
                <p className="font-bold text-xl">{displayData.bedrooms}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600">Salle(s) de bain</p>
                <p className="font-bold text-xl">{displayData.bathrooms || "Non spécifié"}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional features */}
          {(displayData.hasBalcony || displayData.hasTerrasse || displayData.hasPool || displayData.hasElevator || 
            displayData.garageCount !== "0" || displayData.constructionYear) && (
            <div className="mb-8">
              <h2 className="text-2xl font-playfair text-[#CD9B59] mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayData.hasBalcony && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                    <span>Balcon</span>
                  </div>
                )}
                {displayData.hasTerrasse && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                    <span>Terrasse</span>
                  </div>
                )}
                {displayData.hasPool && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                    <span>Piscine</span>
                  </div>
                )}
                {displayData.hasElevator && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                    <span>Ascenseur</span>
                  </div>
                )}
                {displayData.garageCount !== "0" && displayData.garageCount && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                    <span>{parseInt(displayData.garageCount) > 1 ? `${displayData.garageCount} Garages` : "Garage"}</span>
                  </div>
                )}
                {displayData.constructionYear && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                    <span>Construction: {displayData.constructionYear}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* DPE Rating if available */}
          {displayData.dpe && (
            <div className="mb-8">
              <h2 className="text-2xl font-playfair text-[#CD9B59] mb-4">Performance Énergétique</h2>
              <div className="flex items-center">
                <span className={`${getDpeColorClass(displayData.dpe)} px-4 py-2 rounded-md font-bold text-lg`}>
                  {displayData.dpe.toUpperCase()}
                </span>
                <span className="ml-3 text-sm text-gray-600">
                  Diagnostic de Performance Énergétique
                </span>
              </div>
            </div>
          )}
          
          {/* Property full description */}
          <div className="mb-8">
            <h2 className="text-2xl font-playfair text-[#CD9B59] mb-4">Description</h2>
            <div className="prose max-w-none">
              {displayData.fullContent ? (
                <div dangerouslySetInnerHTML={{ __html: displayData.fullContent }} />
              ) : (
                <p className="text-gray-600">
                  {displayData.description || "Aucune description disponible pour ce bien."}
                </p>
              )}
            </div>
          </div>
          
          {/* Contact info */}
          <div className="bg-[#f8f5f0] p-6 rounded-md">
            <h3 className="text-xl font-playfair text-[#CD9B59] mb-3">
              Intéressé par ce bien ?
            </h3>
            <p className="mb-4">Contactez-nous pour plus d'informations ou pour organiser une visite.</p>
            <Button className="bg-[#CD9B59] hover:bg-[#BA8A48] text-white">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
