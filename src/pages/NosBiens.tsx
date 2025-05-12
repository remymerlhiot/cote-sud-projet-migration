
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import PropertyGridFromACF from "@/components/PropertyGridFromACF";

const NosBiens = () => {
  const [filter, setFilter] = useState<string>("");

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

        <PropertyGridFromACF showFilter={false} filter={filter} className="mb-10" />
      </main>

      <Footer />
    </div>
  );
};

export default NosBiens;
