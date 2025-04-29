
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WordPressPage from "@/components/WordPressPage";
import { useCustomPage } from "@/hooks/useCustomPage";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/elementor.css"; // Import the Elementor CSS fixes
import CustomWordPressPage from "@/components/CustomWordPressPage";

const PageTest = () => {
  const { data: pageData, isLoading, isError } = useCustomPage("accueil");

  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-light text-[#CD9B59] text-center mb-12">Test des Pages WordPress</h1>
        
        {/* WordPress page component with the new API */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-[#CD9B59] mb-6">Nouveau API endpoint personnalisé</h2>
          <CustomWordPressPage 
            slug="accueil" 
            cleaningOptions={{
              removeElementorClasses: true,
              simplifyStructure: true, 
              makeImagesResponsive: true,
              fixLinks: true,
              baseDomain: "https://cote-sud.immo"
            }}
          />
        </div>
        
        {/* Legacy WordPress component for comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-[#CD9B59] mb-6">API endpoint standard WordPress</h2>
          <WordPressPage 
            slug="new-home" 
            cleaningOptions={{
              removeElementorClasses: true,
              simplifyStructure: true, 
              makeImagesResponsive: true,
              fixLinks: true,
              baseDomain: "https://cote-sud.immo"
            }}
          />
        </div>
        
        {/* Direct display of page data for testing */}
        <div className="mt-8 p-6 bg-white/50 rounded-lg">
          <h2 className="text-xl font-light text-[#CD9B59] mb-4">Test direct de useCustomPage()</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isError ? (
            <div className="text-red-500">Erreur lors du chargement de la page</div>
          ) : pageData ? (
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#CD9B59]">
                {pageData.title}
              </h3>
              
              {pageData.featured_image && (
                <img 
                  src={pageData.featured_image} 
                  alt={pageData.title} 
                  className="mb-4 max-h-60 rounded-lg"
                />
              )}
              
              <div 
                className="prose max-w-none prose-headings:text-[#CD9B59] prose-headings:font-light"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
              
              {pageData.elementor_data && (
                <div className="mt-4 p-4 bg-slate-100 rounded overflow-auto max-h-60">
                  <h4 className="text-sm font-medium mb-2">Elementor Data (brut):</h4>
                  <pre className="text-xs">{JSON.stringify(pageData.elementor_data, null, 2).substring(0, 500)}...</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-[#CD9B59]">Aucun contenu disponible</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageTest;
