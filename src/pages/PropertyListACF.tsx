
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyGridFromACF from "@/components/PropertyGridFromACF";

const PropertyListACF = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#EEE4D6]">
      <Header />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-4xl font-serif text-[#C8A977] text-center mb-8">NOS BIENS (API ACF)</h1>
        
        <div className="text-center text-[#37373A] mb-12 max-w-2xl mx-auto">
          <p className="font-light">Découvrez notre sélection de biens immobiliers de prestige via l'API WordPress+ACF.</p>
        </div>
        
        <PropertyGridFromACF showFilter={true} className="mb-10" />
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyListACF;
