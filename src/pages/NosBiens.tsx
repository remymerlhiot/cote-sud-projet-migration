
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProperties, transformPropertyData } from "@/hooks/useWordPress";
import PropertyCard from "@/components/PropertyCard";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

const NosBiens = () => {
  // Fetch properties from WordPress API
  const { data: properties, isLoading, error } = useProperties();

  // Show toast error if API fails
  if (error) {
    toast.error("Impossible de récupérer les biens immobiliers");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-3xl font-light text-[#CD9B59] text-center mb-8">NOS BIENS</h1>
        
        <div className="text-center text-[#CD9B59] mb-12">
          <p>Découvrez notre sélection de biens immobiliers de prestige.</p>
        </div>
        
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
            {properties && properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={transformPropertyData(property)} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-[#CD9B59]">Aucun bien immobilier disponible pour le moment.</p>
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
