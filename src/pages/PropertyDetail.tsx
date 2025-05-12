
import { Spinner } from "@/components/ui/spinner";
import { usePropertyDetailsFromAll } from "@/hooks/usePropertyDetailsFromAll";
import PropertyCarousel from "@/components/home/PropertyCarousel";

export default function PropertyDetail() {
  const { property, isLoading } = usePropertyDetailsFromAll();
  if (isLoading) return <Spinner />;
  if (!property) return <p>Propriété introuvable.</p>;

  return (
    <main className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-['FreightBig Pro', serif] text-[#C8A977] mb-4">{property.titre}</h1>
      <PropertyCarousel images={property.allImages} title={property.titre} />
      <section className="mt-6 space-y-4">
        <p className="text-lg text-[#B17226] font-semibold">{property.prix} €</p>
        <p className="text-[#37373A]">{property.description}</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="text-[#37373A]"><span className="font-medium">Ville :</span> {property.ville}</li>
          <li className="text-[#37373A]"><span className="font-medium">Surface :</span> {property.surface} m²</li>
          <li className="text-[#37373A]"><span className="font-medium">Pièces :</span> {property.pieces}</li>
          <li className="text-[#37373A]"><span className="font-medium">Chambres :</span> {property.chambres}</li>
          <li className="text-[#37373A]"><span className="font-medium">Référence :</span> {property.reference}</li>
          {property.hasBalcony && <li className="text-[#37373A]"><span className="font-medium">Balcon</span></li>}
          {property.hasTerrasse && <li className="text-[#37373A]"><span className="font-medium">Terrasse</span></li>}
          {property.hasPool && <li className="text-[#37373A]"><span className="font-medium">Piscine</span></li>}
          {parseInt(property.garageCount || "0") > 0 && (
            <li className="text-[#37373A]"><span className="font-medium">Garage :</span> {property.garageCount}</li>
          )}
          {property.isFurnished && <li className="text-[#37373A]"><span className="font-medium">Meublé</span></li>}
        </ul>
      </section>
    </main>
  );
}
