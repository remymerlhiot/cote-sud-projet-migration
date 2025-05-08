
import React from "react";
import { Separator } from "@/components/ui/separator";

const MainTitleSection = () => {
  return (
    <section className="text-center py-20 px-4 bg-cream">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-sable mb-6">
        L'IMMOBILIER DE PRESTIGE
      </h1>
      <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mb-10" />
      <h2 className="text-2xl md:text-3xl font-playfair font-normal text-cuivre mt-10 mb-12">
        NOS BIENS À LA VENTE
      </h2>
    </section>
  );
};

export default MainTitleSection;
