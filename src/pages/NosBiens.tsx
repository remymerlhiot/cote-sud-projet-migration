
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PropertyGridFromACF from "@/components/PropertyGridFromACF";
import { useProperties } from "@/hooks/useProperties";
import { TransformedProperty } from "@/services/wordpress/types";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const NosBiens = () => {
  const { data: propertiesWP, isLoading } = useProperties();
  const [filter, setFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("wordpress");

  // Filtrer les propriétés WordPress
  const filteredProperties = filter
    ? propertiesWP?.filter(
        (prop) =>
          prop.location.toLowerCase().includes(filter.toLowerCase()) ||
          prop.title.toLowerCase().includes(filter.toLowerCase())
      )
    : propertiesWP;

  return (
    <div className="flex flex-col min-h-screen bg-[#EEE4D6]">
      <Header />

      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-serif text-[#C8A977] text-center mb-8">
          NOS BIENS IMMOBILIERS
        </h1>

        <div className="text-center text-[#37373A] mb-12 max-w-2xl mx-auto">
          <p className="font-light">
            Découvrez notre sélection de biens immobiliers de prestige, 
            minutieusement choisis pour répondre à vos exigences.
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher par ville ou type de bien..."
            className="w-full p-3 border border-[#D3BA92] rounded-md bg-white/80"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <Tabs defaultValue="wordpress" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-[#E3D3BA]">
              <TabsTrigger 
                value="wordpress" 
                className="data-[state=active]:bg-[#C8A977] data-[state=active]:text-white"
              >
                Biens WordPress
              </TabsTrigger>
              <TabsTrigger 
                value="acf" 
                className="data-[state=active]:bg-[#C8A977] data-[state=active]:text-white"
              >
                Biens ACF
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-[#C8A977] data-[state=active]:text-white"
              >
                Tous les biens
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="wordpress" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="h-64 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-5 w-1/3 mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div>
                {filteredProperties && filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property: TransformedProperty) => (
                      <Link
                        to={`/property/${property.id}`}
                        key={property.id}
                        className="block h-full"
                      >
                        <Card className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-0 relative">
                            <div className="relative">
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-56 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                                }}
                              />
                              <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 text-[10px] font-medium">
                                {property.ref}
                              </div>
                              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-[#C8A977]/90 text-white px-3 py-1 text-xs font-medium uppercase">
                                {property.propertyType || "PROPRIÉTÉ"}
                              </div>
                            </div>

                            <div className="p-4 text-center">
                              <h3 className="text-lg font-serif mt-2 text-[#C8A977]">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-600">{property.location}</p>
                              <p className="font-semibold text-lg mb-4 text-[#B17226]">
                                {property.price}
                              </p>

                              <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 mb-4">
                                <div className="flex flex-col items-center">
                                  <p className="text-[10px] text-gray-600">Surface</p>
                                  <p className="font-medium text-sm">
                                    {property.area}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center border-l border-r border-gray-200">
                                  <p className="text-[10px] text-gray-600">Pièces</p>
                                  <p className="font-medium text-sm">
                                    {property.rooms}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center">
                                  <p className="text-[10px] text-gray-600">Chambres</p>
                                  <p className="font-medium text-sm">
                                    {property.bedrooms}
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-white/60 rounded-lg shadow">
                    <h3 className="text-xl text-[#C8A977] font-serif">
                      Aucun bien ne correspond à votre recherche
                    </h3>
                    <p className="mt-2 text-[#37373A]">
                      Veuillez essayer un autre critère ou consulter les nouveaux biens.
                    </p>
                    {filter && (
                      <Button
                        onClick={() => setFilter("")}
                        className="mt-4 bg-[#B17226]"
                      >
                        Réinitialiser la recherche
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="acf" className="mt-4">
            <PropertyGridFromACF showFilter={false} className="mb-10" />
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-[#B17226] mb-4">Biens WordPress</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Skeleton className="h-64 w-full" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-5 w-1/3 mb-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties && filteredProperties.length > 0
                    ? filteredProperties.slice(0, 3).map((property: TransformedProperty) => (
                        <Link
                          to={`/property/${property.id}`}
                          key={property.id}
                          className="block h-full"
                        >
                          <Card className="overflow-hidden border-none shadow-md h-full bg-white hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-0 relative">
                              <div className="relative">
                                <img
                                  src={property.image}
                                  alt={property.title}
                                  className="w-full h-56 object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
                                  }}
                                />
                                <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 text-[10px] font-medium">
                                  {property.ref}
                                </div>
                                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-[#C8A977]/90 text-white px-3 py-1 text-xs font-medium uppercase">
                                  {property.propertyType || "PROPRIÉTÉ"}
                                </div>
                              </div>
                              <div className="p-4 text-center">
                                <h3 className="text-lg font-serif mt-2 text-[#C8A977]">{property.title}</h3>
                                <p className="text-sm text-gray-600">{property.location}</p>
                                <p className="font-semibold text-lg mb-4 text-[#B17226]">{property.price}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    : (
                      <div className="col-span-full text-center py-8">
                        <p>Aucun bien WordPress trouvé</p>
                      </div>
                    )}
                </div>
              )}

              <h2 className="text-2xl font-serif text-[#B17226] mb-4 mt-10">Biens ACF</h2>
              <PropertyGridFromACF limit={3} showFilter={false} className="mb-10" />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default NosBiens;
