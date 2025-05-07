
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProperties } from "@/hooks/useWordPress";
import { transformPropertyData } from "@/services/wordpress";
import PropertyCard from "@/components/PropertyCard";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TransformedProperty } from "@/services/wordpress/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NosBiens = () => {
  // Fetch properties from WordPress API
  const { data: properties, isLoading, error } = useProperties();
  
  // États pour les filtres
  const [filteredProperties, setFilteredProperties] = useState<TransformedProperty[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSurface, setMinSurface] = useState("");
  const [maxSurface, setMaxSurface] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [location, setLocation] = useState("");
  const [hasPool, setHasPool] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasTerrasse, setHasTerrasse] = useState(false);
  const [sortOption, setSortOption] = useState("recent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  // Show toast error if API fails
  if (error) {
    toast.error("Impossible de récupérer les biens immobiliers");
  }

  // Transformer les données et extraire les valeurs uniques pour les filtres
  useEffect(() => {
    if (properties && properties.length > 0) {
      const transformedProperties = properties.map(prop => transformPropertyData(prop));
      
      // Extraire les localisations uniques
      const uniqueLocations = Array.from(
        new Set(transformedProperties.map(prop => prop.location))
      ).filter(loc => loc && loc !== "Non spécifié");
      
      // Extraire les types de propriété uniques
      const uniqueTypes = Array.from(
        new Set(transformedProperties.map(prop => prop.propertyType))
      ).filter(type => type && type !== "Non spécifié");
      
      setLocations(uniqueLocations as string[]);
      setPropertyTypes(uniqueTypes as string[]);
      setFilteredProperties(transformedProperties);
    }
  }, [properties]);

  // Appliquer les filtres
  const applyFilters = () => {
    if (!properties) return;
    
    const transformed = properties.map(prop => transformPropertyData(prop));
    
    const filtered = transformed.filter(property => {
      // Filtre par prix
      if (minPrice && property.priceNumber < parseInt(minPrice)) return false;
      if (maxPrice && property.priceNumber > parseInt(maxPrice)) return false;
      
      // Filtre par surface
      const areaNumerical = parseInt(property.area?.replace("m²", "")) || 0;
      if (minSurface && areaNumerical < parseInt(minSurface)) return false;
      if (maxSurface && areaNumerical > parseInt(maxSurface)) return false;
      
      // Filtre par chambres
      if (minBedrooms && parseInt(property.bedrooms || "0") < parseInt(minBedrooms)) return false;
      
      // Filtre par type de propriété
      if (propertyType && property.propertyType !== propertyType) return false;
      
      // Filtre par localisation
      if (location && !property.location?.toLowerCase().includes(location.toLowerCase())) return false;
      
      // Filtres par caractéristiques
      if (hasPool && !property.hasPool) return false;
      if (hasBalcony && !property.hasBalcony) return false;
      if (hasTerrasse && !property.hasTerrasse) return false;
      
      return true;
    });
    
    // Appliquer le tri
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.priceNumber - b.priceNumber;
        case "price-desc":
          return b.priceNumber - a.priceNumber;
        case "surface-desc":
          const areaA = parseInt(a.area?.replace("m²", "")) || 0;
          const areaB = parseInt(b.area?.replace("m²", "")) || 0;
          return areaB - areaA;
        case "recent":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    
    setFilteredProperties(sorted);
  };

  // Appliquer les filtres lors du changement d'une valeur
  useEffect(() => {
    applyFilters();
  }, [minPrice, maxPrice, minSurface, maxSurface, minBedrooms, propertyType, location, hasPool, hasBalcony, hasTerrasse, sortOption, properties]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinSurface("");
    setMaxSurface("");
    setMinBedrooms("");
    setPropertyType("");
    setLocation("");
    setHasPool(false);
    setHasBalcony(false);
    setHasTerrasse(false);
    setSortOption("recent");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#EEE4D6]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-serif text-[#C8A977] text-center mb-8">NOS BIENS</h1>
        
        <div className="text-center text-[#37373A] mb-12 max-w-2xl mx-auto">
          <p className="font-light">Découvrez notre sélection de biens immobiliers de prestige.</p>
        </div>
        
        {/* Section des filtres - version desktop */}
        <div className="hidden lg:block bg-white shadow-md rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[#C8A977] font-serif">Filtres</h3>
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-[#37373A] hover:text-[#B17226]"
            >
              Réinitialiser
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-[#37373A] mb-1">Prix (€)</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="border-[#C8A977] focus-visible:ring-[#B17226]"
                />
                <span className="text-[#37373A]">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="border-[#C8A977] focus-visible:ring-[#B17226]"
                />
              </div>
            </div>
            
            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-[#37373A] mb-1">Surface (m²)</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minSurface}
                  onChange={(e) => setMinSurface(e.target.value)}
                  className="border-[#C8A977] focus-visible:ring-[#B17226]"
                />
                <span className="text-[#37373A]">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxSurface}
                  onChange={(e) => setMaxSurface(e.target.value)}
                  className="border-[#C8A977] focus-visible:ring-[#B17226]"
                />
              </div>
            </div>
            
            {/* Chambres */}
            <div>
              <label className="block text-sm font-medium text-[#37373A] mb-1">Chambres (min)</label>
              <Input
                type="number"
                placeholder="Chambres minimum"
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
                className="border-[#C8A977] focus-visible:ring-[#B17226]"
              />
            </div>
            
            {/* Type de bien */}
            <div>
              <label className="block text-sm font-medium text-[#37373A] mb-1">Type de bien</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="border-[#C8A977] focus-visible:ring-[#B17226]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-[#37373A] mb-1">Localisation</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-[#C8A977] focus-visible:ring-[#B17226]">
                  <SelectValue placeholder="Toutes les localisations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les localisations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Caractéristiques */}
            <div className="col-span-1 md:col-span-3 lg:col-span-4">
              <label className="block text-sm font-medium text-[#37373A] mb-1">Caractéristiques</label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pool" 
                    checked={hasPool} 
                    onCheckedChange={(checked) => setHasPool(checked === true)}
                    className="border-[#C8A977] data-[state=checked]:bg-[#B17226]"
                  />
                  <label htmlFor="pool" className="text-sm text-[#37373A]">Piscine</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="balcony" 
                    checked={hasBalcony} 
                    onCheckedChange={(checked) => setHasBalcony(checked === true)}
                    className="border-[#C8A977] data-[state=checked]:bg-[#B17226]"
                  />
                  <label htmlFor="balcony" className="text-sm text-[#37373A]">Balcon</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terrasse" 
                    checked={hasTerrasse} 
                    onCheckedChange={(checked) => setHasTerrasse(checked === true)}
                    className="border-[#C8A977] data-[state=checked]:bg-[#B17226]"
                  />
                  <label htmlFor="terrasse" className="text-sm text-[#37373A]">Terrasse</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section des filtres - version mobile */}
        <div className="lg:hidden mb-8">
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <CollapsibleTrigger className="w-full bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div className="flex items-center">
                <ListFilter className="h-5 w-5 text-[#C8A977] mr-2" />
                <span className="font-serif text-[#37373A]">Filtres</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-[#C8A977] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2 bg-white shadow-md rounded-lg p-4">
              <div className="space-y-4">
                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-[#37373A] mb-1">Prix (€)</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="border-[#C8A977] focus-visible:ring-[#B17226]"
                    />
                    <span className="text-[#37373A]">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="border-[#C8A977] focus-visible:ring-[#B17226]"
                    />
                  </div>
                </div>
                
                {/* Surface */}
                <div>
                  <label className="block text-sm font-medium text-[#37373A] mb-1">Surface (m²)</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minSurface}
                      onChange={(e) => setMinSurface(e.target.value)}
                      className="border-[#C8A977] focus-visible:ring-[#B17226]"
                    />
                    <span className="text-[#37373A]">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxSurface}
                      onChange={(e) => setMaxSurface(e.target.value)}
                      className="border-[#C8A977] focus-visible:ring-[#B17226]"
                    />
                  </div>
                </div>
                
                {/* Chambres */}
                <div>
                  <label className="block text-sm font-medium text-[#37373A] mb-1">Chambres (min)</label>
                  <Input
                    type="number"
                    placeholder="Chambres minimum"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                    className="border-[#C8A977] focus-visible:ring-[#B17226]"
                  />
                </div>
                
                {/* Type de bien */}
                <div>
                  <label className="block text-sm font-medium text-[#37373A] mb-1">Type de bien</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="border-[#C8A977] focus-visible:ring-[#B17226]">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les types</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Localisation */}
                <div>
                  <label className="block text-sm font-medium text-[#37373A] mb-1">Localisation</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="border-[#C8A977] focus-visible:ring-[#B17226]">
                      <SelectValue placeholder="Toutes les localisations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les localisations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Caractéristiques */}
                <div>
                  <label className="block text-sm font-medium text-[#37373A] mb-1">Caractéristiques</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pool-mobile" 
                        checked={hasPool} 
                        onCheckedChange={(checked) => setHasPool(checked === true)}
                        className="border-[#C8A977] data-[state=checked]:bg-[#B17226]"
                      />
                      <label htmlFor="pool-mobile" className="text-sm text-[#37373A]">Piscine</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="balcony-mobile" 
                        checked={hasBalcony} 
                        onCheckedChange={(checked) => setHasBalcony(checked === true)}
                        className="border-[#C8A977] data-[state=checked]:bg-[#B17226]"
                      />
                      <label htmlFor="balcony-mobile" className="text-sm text-[#37373A]">Balcon</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terrasse-mobile" 
                        checked={hasTerrasse} 
                        onCheckedChange={(checked) => setHasTerrasse(checked === true)}
                        className="border-[#C8A977] data-[state=checked]:bg-[#B17226]"
                      />
                      <label htmlFor="terrasse-mobile" className="text-sm text-[#37373A]">Terrasse</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="border-[#C8A977] text-[#37373A] hover:bg-[#C8A977] hover:text-white"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="bg-[#C8A977] text-white hover:bg-[#B17226]"
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Tri et résultats */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-[#37373A]">
            {filteredProperties.length} {filteredProperties.length > 1 ? 'biens trouvés' : 'bien trouvé'}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#C8A977] text-[#37373A] hover:bg-[#C8A977] hover:text-white">
                Trier par
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption("recent")}>
                Plus récents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("price-asc")}>
                Prix croissant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("price-desc")}>
                Prix décroissant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("surface-desc")}>
                Surface décroissante
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Liste des propriétés */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-64 w-full" />
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties && filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-[#C8A977] font-serif text-xl">Aucun bien immobilier ne correspond à vos critères.</p>
                <Button 
                  onClick={resetFilters} 
                  className="mt-4 bg-[#C8A977] text-white hover:bg-[#B17226]"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NosBiens;
