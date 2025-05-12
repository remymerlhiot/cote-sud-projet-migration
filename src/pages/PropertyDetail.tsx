import { Spinner } from "@/components/ui/spinner";
import PropertyCarousel from "@/components/PropertyCarousel";
import { usePropertyDetailsFromAll } from "@/hooks/usePropertyDetailsFromAll";

export default function PropertyDetail() {
  const { property, isLoading } = usePropertyDetailsFromAll();
  if (isLoading) return <Spinner />;
  if (!property) return <p>Propriété introuvable.</p>;

  return (
    <main className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-serif mb-4">{property.titre}</h1>
      <PropertyCarousel images={property.allImages} title={property.titre} />
      <section className="mt-6 space-y-4">
        <p className="text-lg text-[#B17226] font-semibold">{property.prix} €</p>
        <p>{property.description}</p>
        <ul className="grid grid-cols-2 gap-2">
          <li>Ville : {property.ville}</li>
          <li>Surface : {property.surface} m²</li>
          <li>Pièces : {property.pieces}</li>
          <li>Chambres : {property.chambres}</li>
          <li>Référence : {property.reference}</li>
          {property.hasBalcony && <li>Balcon</li>}
          {property.hasTerrasse && <li>Terrasse</li>}
          {property.hasPool && <li>Piscine</li>}
          {parseInt(property.garageCount || "0") > 0 && (
            <li>Garage : {property.garageCount}</li>
          )}
          {property.isFurnished && <li>Meublé</li>}
        </ul>
      </section>
    </main>
  );
}
