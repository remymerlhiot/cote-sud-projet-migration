import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePropertyById } from "@/hooks/useProperties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? id : "0";

  // Fetch property details using our hook
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

  // Format date to French format with proper validation
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === "Non spécifié") return "Date non disponible";
    
    // Check if the date string is valid
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "Date non disponible";
      }
      
      return new Intl.DateTimeFormat('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date non disponible";
    }
  };

  // Display helper that montre "NC" pour les valeurs manquantes
  const displayValue = (value?: string | number | null) => {
    if (value === undefined || value === null || value === "" || value === "Non spécifié") {
      return "NC";
    }
    return value;
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
            <h2 className="text-2xl font-serif text-[#CD9B59] mb-4">
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

  // Get all property images - ensure we handle the case where allImages might be empty or undefined
  const propertyImages = displayData.allImages?.length 
    ? displayData.allImages 
    : displayData.image 
      ? [displayData.image] 
      : ["/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"];

  // Check if the property has an agent/negotiator information
  const hasAgentInfo = displayData.negotiatorName && 
                      displayData.negotiatorName !== "Non spécifié" && 
                      (displayData.negotiatorPhone !== "Non spécifié" || 
                       displayData.negotiatorEmail !== "Non spécifié");

  return (
    <div className="flex flex-col min-h-screen bg-[#EEE4D6] font-['Avenir Book', sans-serif] text-[#37373A]">
      <Header />
      
      <main className="flex-grow">
        {/* Property image gallery - Full width */}
        <div className="relative w-full mb-8">
          {propertyImages.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {propertyImages.map((image, index) => (
                  <CarouselItem key={index} className="w-full">
                    <div className="aspect-[16/9] w-full">
                      <img 
                        src={image} 
                        alt={`${displayData.title} - Vue ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log("Image error, using fallback");
                          e.currentTarget.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 z-10 bg-white/70 hover:bg-white text-[#C8A977] border-[#C8A977]" />
              <CarouselNext className="absolute right-4 z-10 bg-white/70 hover:bg-white text-[#C8A977] border-[#C8A977]" />
              
              {/* Price badge */}
              <div className="absolute top-4 right-4 z-10 bg-[#B17226] text-white px-4 py-2 rounded-md text-lg font-semibold">
                {displayData.price}
              </div>
            </Carousel>
          ) : (
            <div className="relative aspect-[16/9] w-full">
              <img 
                src={propertyImages[0]} 
                alt={displayData.title || "Propriété"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Image error, using fallback");
                  e.currentTarget.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                }}
              />
              
              {/* Price badge */}
              <div className="absolute top-4 right-4 z-10 bg-[#B17226] text-white px-4 py-2 rounded-md text-lg font-semibold">
                {displayData.price}
              </div>
            </div>
          )}
        </div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Button variant="outline" asChild className="border-[#C8A977] text-[#C8A977] hover:bg-[#C8A977] hover:text-white">
                <Link to="/nos-biens" className="inline-flex items-center">
                  <ChevronLeft size={16} className="mr-2" /> Retour aux biens
                </Link>
              </Button>
            </div>
            
            {/* Property title */}
            <h1 className="text-3xl md:text-4xl font-['FreightBig Pro', serif] text-[#B17226] mb-6">
              {displayData.title}
            </h1>
            
            {/* Location and reference */}
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-lg font-medium">{displayData.location}</span>
                {displayData.postalCode && displayData.postalCode !== "Non spécifié" && <span className="text-sm ml-2 text-gray-500">({displayData.postalCode})</span>}
              </div>
              <span className="text-sm text-gray-500">Ref. {displayData.ref}</span>
            </div>
            
            {/* Property tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {displayData.propertyType && displayData.propertyType !== "Non spécifié" && (
                <Badge className="bg-[#C8A977] hover:bg-[#C8A977]/80">{displayData.propertyType}</Badge>
              )}
              {displayData.isNewConstruction && (
                <Badge className="bg-green-500 hover:bg-green-600">Neuf</Badge>
              )}
              {displayData.isPrestigious && (
                <Badge className="bg-[#B17226] hover:bg-[#B17226]/80">Prestige</Badge>
              )}
              {displayData.isViager && (
                <Badge className="bg-purple-500 hover:bg-purple-600">Viager</Badge>
              )}
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
                    <p className="font-medium">{displayValue(displayData.propertyType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Localisation</p>
                    <p className="font-medium">{displayData.location}</p>
                    {displayData.postalCode && displayData.postalCode !== "Non spécifié" && <p className="text-xs text-gray-500">{displayData.postalCode}</p>}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Surface</p>
                    <p className="font-medium">{displayValue(displayData.area)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Property features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Pièces</p>
                  <p className="font-bold text-xl">{displayValue(displayData.rooms)}</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Chambres</p>
                  <p className="font-bold text-xl">{displayValue(displayData.bedrooms)}</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600">Salle(s) de bain</p>
                  <p className="font-bold text-xl">{displayValue(displayData.bathrooms)}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Additional features */}
            {(displayData.hasBalcony || displayData.hasTerrasse || displayData.hasPool || displayData.hasElevator || 
              displayData.garageCount !== "0" || displayData.constructionYear || displayData.isFurnished) && (
              <div className="mb-8">
                <h2 className="text-2xl font-['FreightBig Pro', serif] text-[#B17226] mb-4">Caractéristiques</h2>
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
                  {displayData.constructionYear && displayData.constructionYear !== "Non spécifié" && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                      <span>Construction: {displayData.constructionYear}</span>
                    </div>
                  )}
                  {displayData.isFurnished && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                      <span>Meublé</span>
                    </div>
                  )}
                  {displayData.floorNumber && displayData.floorNumber !== "Non spécifié" && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                      <span>Étage: {displayData.floorNumber}</span>
                    </div>
                  )}
                  {displayData.heatingType && displayData.heatingType !== "Non spécifié" && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#C8A977] mr-2"></div>
                      <span>Chauffage: {displayData.heatingType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* DPE Rating if available */}
            {displayData.dpe && displayData.dpe !== "Non spécifié" && (
              <div className="mb-8">
                <h2 className="text-2xl font-['FreightBig Pro', serif] text-[#B17226] mb-4">Performance Énergétique</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                  <span className={`${getDpeColorClass(displayData.dpe)} px-4 py-2 rounded-md font-bold text-lg`}>
                    {displayData.dpe.toUpperCase()}
                  </span>
                  <span className="ml-0 sm:ml-3 mt-2 sm:mt-0 text-sm text-gray-600">
                    Diagnostic de Performance Énergétique 
                    {displayData.dpeValue && displayData.dpeValue !== "Non spécifié" && ` - ${displayData.dpeValue} kWh/m²/an`}
                  </span>
                </div>
                
                {displayData.dpeGes && displayData.dpeGes !== "Non spécifié" && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <span className={`${getDpeColorClass(displayData.dpeGes)} px-4 py-2 rounded-md font-bold text-lg`}>
                      {displayData.dpeGes.toUpperCase()}
                    </span>
                    <span className="ml-0 sm:ml-3 mt-2 sm:mt-0 text-sm text-gray-600">
                      Émissions de Gaz à Effet de Serre
                      {displayData.dpeGesValue && displayData.dpeGesValue !== "Non spécifié" && ` - ${displayData.dpeGesValue} kgCO₂/m²/an`}
                    </span>
                  </div>
                )}
                
                {displayData.dpeDate && displayData.dpeDate !== "Non spécifié" && (
                  <p className="text-xs text-gray-500 mt-4">
                    Date du diagnostic: {formatDate(displayData.dpeDate)}
                  </p>
                )}
              </div>
            )}
            
            {/* Property full description */}
            <div className="mb-8">
              <h2 className="text-2xl font-['FreightBig Pro', serif] text-[#B17226] mb-4">Description</h2>
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
            
            {/* Agent/Negotiator info if available */}
            {hasAgentInfo && (
              <div className="mb-8">
                <h2 className="text-2xl font-['FreightBig Pro', serif] text-[#B17226] mb-4">Votre contact</h2>
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      {displayData.negotiatorPhoto && displayData.negotiatorPhoto !== "Non spécifié" && (
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                          <img 
                            src={displayData.negotiatorPhoto} 
                            alt={displayData.negotiatorName || "Agent"} 
                            className="w-full h-full object-cover"
                            onError={(e) => { 
                              e.currentTarget.src = "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        {displayData.negotiatorName && displayData.negotiatorName !== "Non spécifié" && (
                          <h3 className="font-medium text-lg">{displayData.negotiatorName}</h3>
                        )}
                        <div className="mt-2 space-y-1">
                          {displayData.negotiatorPhone && displayData.negotiatorPhone !== "Non spécifié" && (
                            <p className="flex items-center">
                              <span className="font-medium mr-2">Téléphone:</span>
                              <a href={`tel:${displayData.negotiatorPhone}`} className="text-[#B17226] hover:underline">
                                {displayData.negotiatorPhone}
                              </a>
                            </p>
                          )}
                          {displayData.negotiatorEmail && displayData.negotiatorEmail !== "Non spécifié" && (
                            <p className="flex items-center">
                              <span className="font-medium mr-2">Email:</span>
                              <a href={`mailto:${displayData.negotiatorEmail}`} className="text-[#B17226] hover:underline">
                                {displayData.negotiatorEmail}
                              </a>
                            </p>
                          )}
                          {(displayData.negotiatorCity || displayData.negotiatorPostalCode) && 
                            (displayData.negotiatorCity !== "Non spécifié" || displayData.negotiatorPostalCode !== "Non spécifié") && (
                            <p className="flex items-center">
                              <span className="font-medium mr-2">Localisation:</span>
                              {displayData.negotiatorPostalCode} {displayData.negotiatorCity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Contact info */}
            <div className="bg-white p-6 rounded-md shadow-md mb-8">
              <h3 className="text-xl font-['FreightBig Pro', serif] text-[#B17226] mb-3">
                Intéressé par ce bien ?
              </h3>
              <p className="mb-4">Contactez-nous pour plus d'informations ou pour organiser une visite.</p>
              <Button className="bg-[#C8A977] hover:bg-[#B17226] text-white">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
