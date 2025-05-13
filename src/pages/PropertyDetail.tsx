import { Spinner } from "@/components/ui/spinner";
import { usePropertyDetailsFromAll } from "@/hooks/usePropertyDetailsFromAll";
import PropertyCarousel from "@/components/PropertyCarousel";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PropertyDetail() {
  const { property, isLoading } = usePropertyDetailsFromAll();
  const navigate = useNavigate();
  const [imageStatus, setImageStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (property) {
      document.title = `${property.titre} | Côté Sud Immobilier`;

      // Debugging plus détaillé des images
      console.log(`Propriété ${property.id}: ${property.allImages.length} images disponibles`);
      
      // Vérifier l'accessibilité des images
      const newImageStatus: {[key: string]: boolean} = {};
      
      if (property.allImages.length > 0) {
        // Vérification des 3 premières images
        property.allImages.slice(0, 3).forEach((url, index) => {
          console.log(`Image ${index+1}: ${url}`);
          
          // Tester si l'image est accessible
          const img = new Image();
          img.onload = () => {
            console.log(`✅ Image ${index+1} chargée avec succès`);
            setImageStatus(prev => ({...prev, [url]: true}));
          };
          img.onerror = () => {
            console.error(`❌ Erreur de chargement de l'image ${index+1}`);
            setImageStatus(prev => ({...prev, [url]: false}));
          };
          img.src = url;
          
          // Par défaut, l'image est en cours de chargement
          newImageStatus[url] = false;
        });
        
        setImageStatus(newImageStatus);
      } else {
        console.warn("⚠️ Aucune image trouvée pour cette propriété!");
      }
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

      {/* Debug info - à commenter en production */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mb-4 p-2 bg-gray-100 rounded">
          <summary className="cursor-pointer text-sm text-gray-600">
            Infos de débogage ({property.allImages.length} images)
          </summary>
          <div className="p-2 text-xs">
            <p>Nombre d'images: {property.allImages.length}</p>
            {property.allImages.length > 0 && (
              <div>
                <p className="mt-1 font-semibold">Premières images:</p>
                <ul className="list-disc pl-5">
                  {property.allImages.slice(0, 3).map((url, idx) => (
                    <li key={idx} className="mb-1">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`${imageStatus[url] === false ? "text-red-500" : "text-blue-500"} hover:underline`}
                      >
                        Image {idx+1}: {url.substring(url.lastIndexOf('/') + 1)}
                      </a>
                      {imageStatus[url] === false ? " ❌" : imageStatus[url] === true ? " ✅" : " ⏳"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      )}

      {/* Pass property.allImages to PropertyCarousel */}
      <PropertyCarousel 
        images={property.allImages} 
        title={property.titre}
      />

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
            {property.pieces && (
              <li className="flex items-center text-[#37373A]">
                <span className="font-medium w-28">Pièces</span>
                <span>{property.pieces}</span>
              </li>
            )}
            {property.chambres && (
              <li className="flex items-center text-[#37373A]">
                <span className="font-medium w-28">Chambres</span>
                <span>{property.chambres}</span>
              </li>
            )}
            {property.bathrooms && (
              <li className="flex items-center text-[#37373A]">
                <span className="font-medium w-28">Salles de bain</span>
                <span>{property.bathrooms}</span>
              </li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}