
import React from "react";

const ServicesSection = () => {
  return (
    <section className="relative mb-20">
      <div className="w-full h-[600px] bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png')" }}>
        <div className="absolute inset-0 bg-black/60">
          <div className="container mx-auto h-full flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 text-center md:text-left p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-playfair font-normal text-[#CD9B59] mb-6">
                SERVICES DE L'AGENCE
              </h2>
            </div>
            <div className="md:w-2/3 p-8 md:p-12">
              <div className="space-y-8">
                <div className="border-b border-[#CD9B59]/30 pb-4">
                  <h3 className="text-xl font-playfair font-normal text-[#CD9B59] mb-2">L'ESTIMATION</h3>
                  <p className="text-white text-sm">
                    Nous réalisons un rapport détaillé du bien et déterminons sa valeur après une analyse géographique et de marché pour optimiser le prix de vente et obtenir le prix juste du bien.
                  </p>
                </div>
                <div className="border-b border-[#CD9B59]/30 pb-4">
                  <h3 className="text-xl font-playfair font-normal text-[#CD9B59] mb-2">UNE DIFFUSION CIBLÉE</h3>
                </div>
                <div>
                  <h3 className="text-xl font-playfair font-normal text-[#CD9B59] mb-2">L'OFFRE D'ACHAT</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
