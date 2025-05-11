
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Mail, Phone, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

// ID du widget Jestimo pour l'estimation
const WIDGET_ID = "11bS96785252f655f6Xy524293v7P112";
const WIDGET_CONTAINER_ID = `jst__est_${WIDGET_ID}`;

// Composant pour l'outil d'estimation Jestimo
const EstimationWidget: React.FC = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  // Charger le script Jestimo de manière sécurisée après le rendu du composant
  useEffect(() => {
    // Ne pas recharger si le script est déjà présent
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = `https://expert.jestimo.com/widget-jwt/${WIDGET_ID}/script.js`;
      script.async = true;
      script.defer = true;
      
      // Stocker la référence pour éviter les rechargements
      scriptRef.current = script;
      
      // Ajouter le script au document
      document.body.appendChild(script);
      
      // Nettoyer le script quand le composant est démonté
      return () => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
          scriptRef.current = null;
        }
      };
    }
  }, []);
  
  return (
    <div className="w-full min-h-[600px]">
      {/* Div conteneur pour le widget Jestimo qui sera ciblé par le script */}
      <div id={WIDGET_CONTAINER_ID} className="w-full min-h-[600px] bg-white"></div>
    </div>
  );
};

// Formulaire de secours en cas de problème avec l'iframe
const FallbackForm: React.FC = () => {
  return (
    <Card className="mt-8 bg-sable-30 border-sable-50">
      <CardContent className="pt-6">
        <h3 className="font-playfair text-2xl text-cuivre mb-4">Contactez-nous pour une estimation</h3>
        <p className="mb-6 text-anthracite">
          Notre équipe d'experts immobiliers est à votre disposition pour estimer votre bien. 
          Contactez-nous directement:
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button className="bg-cuivre hover:bg-sable text-white flex gap-2 items-center">
            <Phone size={18} />
            <span>04 94 XX XX XX</span>
          </Button>
          <Button className="bg-anthracite hover:bg-sable-80 text-white flex gap-2 items-center">
            <Mail size={18} />
            <span>contact@cote-sud.immo</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Estimation: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  
  // Forcer le chargement du widget quand la dialog est ouverte
  useEffect(() => {
    if (dialogOpen && !widgetLoaded) {
      setWidgetLoaded(true);
    }
  }, [dialogOpen, widgetLoaded]);
  
  return (
    <>
      <Helmet>
        <title>Estimation immobilière | Côté Sud Immobilier</title>
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
            
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl md:text-3xl text-cuivre mb-4">
                    Lancez votre estimation gratuitement
                  </h2>
                  <p className="text-anthracite mb-6">
                    Notre outil d'estimation vous permet d'obtenir une première évaluation de votre bien immobilier en quelques minutes.
                  </p>
                  
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg"
                        className="bg-cuivre hover:bg-sable-80 text-white font-medium gap-2"
                      >
                        <BarChart className="h-5 w-5" />
                        Estimer mon bien
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                      <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-2xl font-playfair text-cuivre">
                          Estimation de votre bien immobilier
                        </DialogTitle>
                        <DialogDescription>
                          Remplissez le formulaire pour obtenir une estimation précise.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="px-0 py-0 overflow-hidden">
                        {widgetLoaded && <EstimationWidget />}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="text-sm text-anthracite/80 italic mb-6">
                  Cette estimation en ligne est indicative. Pour une évaluation précise, nos experts peuvent vous accompagner sur place.
                </div>
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
                  Notre expertise du marché immobilier sur la Côté d'Azur nous permet de vous offrir une estimation précise et personnalisée.
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
              
              <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-lg border border-sable-30 text-center">
                <h3 className="font-playfair text-xl md:text-2xl text-cuivre mb-4">
                  Besoin d'une expertise immédiate ?
                </h3>
                <p className="text-anthracite text-sm md:text-base mb-6">
                  Nos conseillers immobiliers sont à votre disposition pour réaliser une estimation personnalisée de votre bien.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button className="bg-cuivre hover:bg-sable text-white flex gap-2 items-center">
                    <Phone size={18} />
                    <span>04 94 XX XX XX</span>
                  </Button>
                  <Button className="bg-anthracite hover:bg-sable-80 text-white flex gap-2 items-center">
                    <Mail size={18} />
                    <span>contact@cote-sud.immo</span>
                  </Button>
                </div>
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
