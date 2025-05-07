
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const Estimation: React.FC = () => {
  useEffect(() => {
    // Création de l'élément script
    const script = document.createElement("script");
    script.src = "https://expert.jestimo.com/widget-jwt/11bS96785252f655f6Xy524293v7P112";
    script.async = true;
    
    // Ajout du script au document
    document.body.appendChild(script);
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Suppression du script lors du démontage du composant
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
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
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl md:text-5xl text-cuivre mb-6 text-center">
              Estimation immobilière
            </h1>
            
            <div className="mb-8 text-center">
              <p className="text-anthracite text-lg mb-4 max-w-3xl mx-auto">
                Obtenez une estimation précise de votre bien immobilier sur la Côte d'Azur grâce à notre outil d'estimation en ligne.
              </p>
              <div className="w-32 h-0.5 bg-sable-50 mx-auto"></div>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
              {/* Conteneur du widget */}
              <div id="jst__est_11bS96785252f655f6Xy524293v7P112" className="w-full min-h-[600px]"></div>
            </div>
            
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-sable-30 p-6 rounded-lg">
                <h3 className="font-playfair text-2xl text-cuivre mb-4">
                  Pourquoi estimer votre bien ?
                </h3>
                <p className="text-anthracite mb-4">
                  L'estimation immobilière est une étape clé dans votre projet de vente. Elle vous permet de connaître la juste valeur de votre bien sur le marché actuel et d'établir un prix de vente cohérent.
                </p>
                <p className="text-anthracite">
                  Notre expertise du marché immobilier sur la Côte d'Azur nous permet de vous offrir une estimation précise et personnalisée.
                </p>
              </div>
              
              <div className="bg-sable-30 p-6 rounded-lg">
                <h3 className="font-playfair text-2xl text-cuivre mb-4">
                  Notre expertise à votre service
                </h3>
                <p className="text-anthracite mb-4">
                  Notre agence immobilière de luxe vous accompagne dans toutes les étapes de votre projet immobilier, de l'estimation à la vente.
                </p>
                <p className="text-anthracite">
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
