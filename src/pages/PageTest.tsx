
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WordPressPage from "@/components/WordPressPage";

const PageTest = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-light text-[#CD9B59] text-center mb-12">Test de la Page WordPress</h1>
        
        {/* WordPress page component with the slug of the page to fetch */}
        <WordPressPage slug="accueil" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageTest;
