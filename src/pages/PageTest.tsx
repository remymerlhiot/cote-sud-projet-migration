
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WordPressPage from "@/components/WordPressPage";
import { useAccueilPage } from "@/hooks/useAccueilPage";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/elementor.css"; // Import the Elementor CSS fixes

const PageTest = () => {
  const { data: pageData, isLoading, isError } = useAccueilPage();

  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-light text-[#CD9B59] text-center mb-12">Test de la Page WordPress</h1>
        
        {/* WordPress page component with the slug of the page to fetch */}
        <div className="mb-12">
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
        
        {/* Direct display of page data for testing/comparison */}
        <div className="mt-8 p-6 bg-white/50 rounded-lg">
          <h2 className="text-xl font-light text-[#CD9B59] mb-4">Test direct de useAccueilPage()</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : isError ? (
            <div className="text-red-500">Erreur lors du chargement de la page</div>
          ) : pageData ? (
            <div>
              <h3 
                className="text-lg font-medium mb-4 text-[#CD9B59]"
                dangerouslySetInnerHTML={{ __html: pageData.title.rendered }}
              />
              
              {pageData.featured_media_url && (
                <img 
                  src={pageData.featured_media_url} 
                  alt={pageData.title.rendered} 
                  className="mb-4 max-h-60 rounded-lg"
                />
              )}
              
              <div 
                className="prose max-w-none prose-headings:text-[#CD9B59] prose-headings:font-light"
                dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
              />
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
