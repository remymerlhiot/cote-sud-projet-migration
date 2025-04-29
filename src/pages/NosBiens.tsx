import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NosBiens = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Content will be added later */}
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Contenu à venir</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NosBiens;
