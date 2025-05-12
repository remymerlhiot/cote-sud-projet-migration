
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WordPressPage from "@/components/WordPressPage";
import { useCustomPage } from "@/hooks/useCustomPage";
import { usePageBySlug } from "@/hooks/useWordPress";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/elementor.css"; // Import the Elementor CSS fixes
import CustomWordPressPage from "@/components/CustomWordPressPage";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const PageTest = () => {
  const { data: customPageData, isLoading: customLoading, isError: customError } = useCustomPage("accueil");
  const { data: standardPageData, isLoading: standardLoading, isError: standardError } = usePageBySlug("accueil");

  return (
    <div className="flex flex-col min-h-screen bg-[#f2e9da]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <h1 className="text-3xl font-light text-[#CD9B59] text-center mb-8">Test de Compatibilité API WordPress</h1>

        {/* API Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Custom API Status */}
          <Alert variant={customError ? "destructive" : "default"} className="bg-white/70">
            <div className="flex items-center gap-2">
              {customError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              <AlertTitle>API WordPress Personnalisée (axo/v1)</AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {customError ? (
                <span className="text-red-500">Non disponible - L'API personnalisée renvoie une erreur</span>
              ) : customLoading ? (
                <span className="text-amber-500">Chargement en cours...</span>
              ) : customPageData ? (
                <span className="text-green-500">Disponible et fonctionnelle</span>
              ) : (
                <span className="text-amber-500">Disponible mais aucune donnée trouvée</span>
              )}
            </AlertDescription>
          </Alert>

          {/* Standard API Status */}
          <Alert variant={standardError ? "destructive" : "default"} className="bg-white/70">
            <div className="flex items-center gap-2">
              {standardError ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              <AlertTitle>API WordPress Standard (wp/v2)</AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {standardError ? (
                <span className="text-red-500">Non disponible - L'API standard renvoie une erreur</span>
              ) : standardLoading ? (
                <span className="text-amber-500">Chargement en cours...</span>
              ) : standardPageData ? (
                <span className="text-green-500">Disponible et fonctionnelle</span>
              ) : (
                <span className="text-amber-500">Disponible mais aucune donnée trouvée</span>
              )}
            </AlertDescription>
          </Alert>
        </div>
        
        {/* WordPress page component with the new API */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-[#CD9B59] mb-6">Nouveau API endpoint personnalisé (avec fallback)</h2>
          <div className="bg-white/50 p-6 rounded-lg">
            <CustomWordPressPage 
              slug="accueil" 
              cleaningOptions={{
                removeElementorClasses: true,
                simplifyStructure: true, 
                makeImagesResponsive: true,
                fixLinks: true,
                baseDomain: "https://cote-sud.immo"
              }}
              debugMode={true}
            />
          </div>
        </div>
        
        {/* Legacy WordPress component for comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-[#CD9B59] mb-6">API endpoint standard WordPress</h2>
          <div className="bg-white/50 p-6 rounded-lg">
            <WordPressPage 
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
        </div>
        
        {/* Direct display of page data for testing */}
        <div className="mt-8 p-6 bg-white/50 rounded-lg">
          <h2 className="text-xl font-light text-[#CD9B59] mb-4">Test direct de useCustomPage() avec fallback</h2>
          
          {customLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : customError ? (
            <div className="text-red-500">
              <p>Erreur lors du chargement de la page avec l'API personnalisée</p>
              <p className="mt-2">Statut: Tentative de fallback vers l'API standard</p>
            </div>
          ) : customPageData ? (
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#CD9B59]">
                {customPageData.title}
              </h3>
              
              {customPageData.featured_image && (
                <img 
                  src={customPageData.featured_image} 
                  alt={customPageData.title} 
                  className="mb-4 max-h-60 rounded-lg"
                />
              )}
              
              <div 
                className="prose max-w-none prose-headings:text-[#CD9B59] prose-headings:font-light"
                dangerouslySetInnerHTML={{ __html: customPageData.content }}
              />
              
              {customPageData.elementor_data && (
                <div className="mt-4 p-4 bg-slate-100 rounded overflow-auto max-h-60">
                  <h4 className="text-sm font-medium mb-2">Elementor Data (brut):</h4>
                  <pre className="text-xs">{JSON.stringify(customPageData.elementor_data, null, 2).substring(0, 500)}...</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-[#CD9B59]">Aucun contenu disponible via les deux APIs</div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageTest;
