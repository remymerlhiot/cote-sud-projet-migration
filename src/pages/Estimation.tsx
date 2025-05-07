
import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const Estimation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const loadAttempts = useRef(0);
  const maxAttempts = 3;
  
  const loadEstimationWidget = () => {
    // Réinitialiser l'état
    setIsLoading(true);
    setScriptError(null);
    
    // Incrémente le compteur de tentatives
    loadAttempts.current += 1;
    
    // Si le script existe déjà, le supprimer
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    
    // Création de l'élément script
    const script = document.createElement("script");
    script.src = "https://expert.jestimo.com/widget-jwt/11bS96785252f655f6Xy524293v7P112";
    script.async = true;
    scriptRef.current = script;
    
    // Gérer le chargement réussi
    script.onload = () => {
      console.log("Widget script loaded successfully");
      // Attendre un peu que le widget s'initialise
      setTimeout(() => {
        const container = document.getElementById("jst__est_11bS96785252f655f6Xy524293v7P112");
        if (container) {
          // Vérifier si le widget a bien été initialisé (contient des éléments enfants)
          if (container.children.length > 0) {
            setIsLoading(false);
          } else {
            console.error("Widget container exists but has no children. Retrying...");
            // Si le conteneur existe mais est vide, réessayer après un court délai
            if (loadAttempts.current < maxAttempts) {
              setTimeout(loadEstimationWidget, 2000);
            } else {
              setIsLoading(false);
              setScriptError("Le widget d'estimation n'a pas pu être chargé correctement. Veuillez rafraîchir la page.");
            }
          }
        } else {
          console.error("Widget container not found");
          setScriptError("Le conteneur du widget n'a pas été trouvé.");
          setIsLoading(false);
        }
      }, 1500);
    };
    
    // Gérer les erreurs de chargement
    script.onerror = () => {
      console.error("Failed to load estimation widget script");
      if (loadAttempts.current < maxAttempts) {
        console.log(`Retrying (${loadAttempts.current}/${maxAttempts})...`);
        setTimeout(loadEstimationWidget, 2000);
      } else {
        setScriptError("Impossible de charger le widget d'estimation. Veuillez vérifier votre connexion internet.");
        setIsLoading(false);
      }
    };
    
    // Ajout du script au document
    document.body.appendChild(script);
  };
  
  useEffect(() => {
    // Charger le widget lors du montage du composant
    loadEstimationWidget();
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Suppression du script lors du démontage du composant
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);
  
  const handleRefresh = () => {
    loadAttempts.current = 0;
    loadEstimationWidget();
  };
  
  return (
    <>
      <Helmet>
        <title>Estimation immobilière | Côte Sud Immobilier</title>
        <meta name="description" content="Estimez la valeur de votre bien immobilier sur la Côte d'Azur avec notre outil d'estimation en ligne gratuit." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-cream font-raleway">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-grow container mx-auto py-8 md:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-3xl md:text-5xl text-cuivre mb-4 md:mb-6 text-center">
              Estimation immobilière
            </h1>
            
            <div className="mb-6 md:mb-8 text-center">
              <p className="text-anthracite text-base md:text-lg mb-4 max-w-3xl mx-auto">
                Obtenez une estimation précise de votre bien immobilier sur la Côte d'Azur grâce à notre outil d'estimation en ligne.
              </p>
              <div className="w-24 md:w-32 h-0.5 bg-sable-50 mx-auto"></div>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-8">
              {/* Conteneur du widget avec état de chargement */}
              <div className="relative w-full">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-sable-30/30 rounded-lg z-10">
                    <Loader2 className="h-8 w-8 text-cuivre animate-spin mb-2" />
                    <p className="text-anthracite font-medium">Chargement de l'outil d'estimation...</p>
                  </div>
                )}
                
                {scriptError && (
                  <div className="text-center py-16">
                    <p className="text-red-500 mb-4">{scriptError}</p>
                    <button 
                      onClick={handleRefresh}
                      className="bg-cuivre hover:bg-sable text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Réessayer
                    </button>
                  </div>
                )}
                
                {/* Conteneur du widget */}
                <div id="jst__est_11bS96785252f655f6Xy524293v7P112" className="w-full min-h-[600px]"></div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-sable-30 p-4 md:p-6 rounded-lg">
                <h3 className="font-playfair text-xl md:text-2xl text-cuivre mb-4">
                  Pourquoi estimer votre bien ?
                </h3>
                <p className="text-anthracite text-sm md:text-base mb-4">
                  L'estimation immobilière est une étape clé dans votre projet de vente. Elle vous permet de connaître la juste valeur de votre bien sur le marché actuel et d'établir un prix de vente cohérent.
                </p>
                <p className="text-anthracite text-sm md:text-base">
                  Notre expertise du marché immobilier sur la Côte d'Azur nous permet de vous offrir une estimation précise et personnalisée.
                </p>
              </div>
              
              <div className="bg-sable-30 p-4 md:p-6 rounded-lg">
                <h3 className="font-playfair text-xl md:text-2xl text-cuivre mb-4">
                  Notre expertise à votre service
                </h3>
                <p className="text-anthracite text-sm md:text-base mb-4">
                  Notre agence immobilière de luxe vous accompagne dans toutes les étapes de votre projet immobilier, de l'estimation à la vente.
                </p>
                <p className="text-anthracite text-sm md:text-base">
                  Nos consultants sont disponibles pour affiner cette estimation et vous proposer une stratégie de vente adaptée à vos objectifs.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Estimation;
