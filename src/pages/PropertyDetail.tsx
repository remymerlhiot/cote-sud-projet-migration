
import React from "react";
import { useParams } from "react-router-dom";
import { usePropertyById } from "@/hooks/useProperties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? id : "0";

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
          
          {/* Property image */}
          <div className="mb-8 relative">
            <img 
              src={displayData.image} 
              alt={displayData.title} 
              className="w-full h-auto object-cover rounded-md"
            />
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
                  <p className="text-sm text-gray-600">Prix</p>
                  <p className="font-bold text-lg text-[#CD9B59]">{displayData.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-medium">{displayData.location}</p>
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
                <p className="text-sm text-gray-600">Date de publication</p>
                <p className="font-medium">
                  {new Date(displayData.date || "").toLocaleDateString("fr-FR")}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Property full description */}
          <div className="mb-8">
            <h2 className="text-2xl font-playfair text-[#CD9B59] mb-4">Description</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: displayData.fullContent }}
            />
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
