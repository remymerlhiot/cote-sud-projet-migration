
import { Spinner } from "@/components/ui/spinner";
import { usePropertyDetailsFromAll } from "@/hooks/usePropertyDetailsFromAll";
import PropertyCarousel from "@/components/PropertyCarousel";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PropertyDetail() {
  const { property, isLoading } = usePropertyDetailsFromAll();
  const navigate = useNavigate();

  useEffect(() => {
    if (property) {
      document.title = `${property.titre} | Côté Sud Immobilier`;

      // Use property.allImages here
      console.log(`Propriété ${property.id}: ${property.allImages.length} images disponibles`);
      console.log("URLs des images:", property.allImages);
    }
  }, [property]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!property) {
    toast({
      title: "Erreur",
      description: "Propriété introuvable. Vous allez être redirigé vers la liste des biens.",
      variant: "destructive",
    });

    setTimeout(() => navigate("/biens"), 2000);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-[#B17226]">Propriété introuvable.</p>
        <p className="mt-2">Redirection en cours...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-serif text-[#C8A977] mb-6">{property.titre}</h1>

      {/* Pass property.allImages to PropertyCarousel */}
      <PropertyCarousel images={property.allImages} title={property.titre} />

      <section className="mt-8 space-y-6">
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-2xl text-[#B17226] font-semibold">{property.prix} €</p>
          <p className="text-sm text-gray-500">Référence: {property.reference}</p>
        </div>

        <Separator className="my-6 bg-[#EEE4D6]" />

        <div className="prose max-w-none text-[#37373A]">
          <p>{property.description}</p>
        </div>

        <div className="bg-[#EEE4D6]/30 p-6 rounded-md mt-8">
          <h2 className="text-xl font-serif text-[#C8A977] mb-4">Caractéristiques</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <li className="flex items-center text-[#37373A]">
              <span className="font-medium w-28">Ville</span>
              <span>{property.ville}</span>
            </li>
            <li className="flex items-center text-[#37373A]">
              <span className="font-medium w-28">Surface</span>
              <span>{property.surface} m²</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
