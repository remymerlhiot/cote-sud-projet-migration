
import { useAcfProperties, NormalizedProperty } from "@/hooks/useAcfProperties";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PropertyGridProps {
  limit?: number;
  className?: string;
  showFilter?: boolean;
}

const PropertyGridFromACF = ({ limit, className = "", showFilter = false }: PropertyGridProps) => {
  const { data: properties, isLoading, error } = useAcfProperties();
  const [filter, setFilter] = useState<string>("");
  
  // Données de secours si l'API échoue
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

  // Utiliser soit les données de l'API, soit les données de secours
  const displayProperties = (properties && properties.length > 0) 
    ? properties 
    : fallbackProperties;

  // Limiter le nombre de propriétés affichées si nécessaire
  const limitedProperties = limit 
    ? displayProperties.slice(0, limit) 
    : displayProperties;
  
  // Filtrer les propriétés si le filtre est actif
  const filteredProperties = filter 
    ? limitedProperties.filter(prop => 
        prop.ville.toLowerCase().includes(filter.toLowerCase()) || 
        prop.titre.toLowerCase().includes(filter.toLowerCase())
      )
    : limitedProperties;

  // Composant de carte pour chaque propriété
  const PropertyCard = ({ property }: { property: NormalizedProperty }) => {
    return (
      <Link to={`/property/${property.id}`} className="block h-full">
        <Card className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0 relative">
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
              <p className="font-semibold text-lg mb-4 text-[#B17226]">
                {property.prix}
              </p>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 mb-4">
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

              <div className="mt-4 flex justify-center">
                <span className="inline-block px-4 py-2 bg-[#C8A977] text-white text-xs rounded-sm hover:bg-[#B17226] transition-colors">
                  Voir le détail
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  // Affichage des skeletons pendant le chargement
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit || 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-1/3 mx-auto" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Affichage du message d'erreur (en utilisant les données de secours)
  if (error) {
    console.error("Erreur lors du chargement des propriétés:", error);
  }

  return (
    <div className={className}>
      {showFilter && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Filtrer par ville ou type de bien..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
        
        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-[#C8A977] font-serif text-xl">Aucun bien immobilier disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyGridFromACF;
