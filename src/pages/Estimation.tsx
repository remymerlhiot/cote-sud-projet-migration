
import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Loader2, Mail, Phone, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

const WIDGET_ID = "11bS96785252f655f6Xy524293v7P112";
const WIDGET_CONTAINER_ID = `jst__est_${WIDGET_ID}`;
const SCRIPT_URL = `https://expert.jestimo.com/widget-jwt/${WIDGET_ID}`;
const MAX_LOAD_ATTEMPTS = 5;
const LOAD_TIMEOUT = 3000; // 3 secondes avant de tenter à nouveau
const INIT_CHECK_TIMEOUT = 1000; // Verifications périodiques

interface WindowWithWidgetStatus extends Window {
  _jestimoWidgetLoaded?: boolean;
  _jestimoWidgetInitialized?: boolean;
}

declare const window: WindowWithWidgetStatus;

const EstimationWidget: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [widgetStatus, setWidgetStatus] = useState<'loading' | 'loaded' | 'error' | 'fallback'>('loading');
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const loadAttempts = useRef(0);
  const checkInterval = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Fonction pour nettoyer les listeners et intervalles
  const cleanup = () => {
    if (checkInterval.current) {
      window.clearInterval(checkInterval.current);
      checkInterval.current = null;
    }
    
    // Reset global tracking variables
    window._jestimoWidgetLoaded = false;
    window._jestimoWidgetInitialized = false;
    
    // Supprimer le script s'il existe
    if (scriptRef.current && document.body.contains(scriptRef.current)) {
      document.body.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
  };
  
  // Vérifier périodiquement si le widget est initialisé
  const startWidgetCheck = () => {
    // Nettoyer les checks précédents
    if (checkInterval.current) {
      window.clearInterval(checkInterval.current);
    }
    
    // Variable pour compter les vérifications
    let checks = 0;
    const MAX_CHECKS = 10; // Max 10 vérifications (10 secondes au total)
    
    checkInterval.current = window.setInterval(() => {
      checks++;
      
      const container = document.getElementById(WIDGET_CONTAINER_ID);
      const isInitialized = window._jestimoWidgetInitialized === true || 
                         (container && container.children.length > 2);
      
      console.log(`Widget check #${checks}: Container exists: ${!!container}, Children: ${container?.children.length || 0}`);
      
      if (isInitialized) {
        // Widget est chargé avec succès
        window.clearInterval(checkInterval.current!);
        setIsLoading(false);
        setWidgetStatus('loaded');
        window._jestimoWidgetInitialized = true;
        console.log("Widget initialized successfully");
      } else if (checks >= MAX_CHECKS) {
        // Timeout après 10 vérifications
        window.clearInterval(checkInterval.current!);
        
        if (loadAttempts.current < MAX_LOAD_ATTEMPTS) {
          console.log(`Widget initialization timeout. Retrying (${loadAttempts.current + 1}/${MAX_LOAD_ATTEMPTS})...`);
          loadEstimationWidget();
        } else {
          setIsLoading(false);
          setScriptError("Le widget d'estimation n'a pas pu s'initialiser correctement. Veuillez utiliser notre formulaire de contact ci-dessous.");
          setWidgetStatus('fallback');
          console.error("Widget initialization failed after multiple attempts");
          toast({
            title: "Problème avec l'outil d'estimation",
            description: "Nous avons rencontré un problème technique. N'hésitez pas à nous contacter directement.",
            variant: "destructive"
          });
        }
      }
    }, INIT_CHECK_TIMEOUT);
  };
  
  const loadEstimationWidget = () => {
    // Réinitialiser l'état
    setIsLoading(true);
    setScriptError(null);
    setWidgetStatus('loading');
    
    // Nettoyage préalable
    cleanup();
    
    // Incrémente le compteur de tentatives
    loadAttempts.current += 1;
    console.log(`Loading widget attempt ${loadAttempts.current}/${MAX_LOAD_ATTEMPTS}`);
    
    // S'assurer que le conteneur existe
    let container = document.getElementById(WIDGET_CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = WIDGET_CONTAINER_ID;
      container.className = "w-full min-h-[600px]";
      
      const widgetArea = document.getElementById('widget-container-area');
      if (widgetArea) {
        widgetArea.innerHTML = '';
        widgetArea.appendChild(container);
      } else {
        console.error("Widget container area not found");
        setScriptError("Zone de conteneur introuvable");
        setIsLoading(false);
        setWidgetStatus('error');
        return;
      }
    }
    
    // Création de l'élément script dans le head pour un meilleur chargement
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    scriptRef.current = script;
    
    // Marquage global pour suivi de l'état
    window._jestimoWidgetLoaded = false;
    
    // Gérer le chargement réussi
    script.onload = () => {
      console.log("Widget script loaded successfully");
      window._jestimoWidgetLoaded = true;
      
      // Commencer la vérification périodique de l'initialisation
      startWidgetCheck();
    };
    
    // Gérer les erreurs de chargement
    script.onerror = () => {
      console.error("Failed to load estimation widget script");
      if (loadAttempts.current < MAX_LOAD_ATTEMPTS) {
        console.log(`Retrying in ${LOAD_TIMEOUT/1000}s (${loadAttempts.current}/${MAX_LOAD_ATTEMPTS})...`);
        setTimeout(loadEstimationWidget, LOAD_TIMEOUT);
      } else {
        setScriptError("Impossible de charger le widget d'estimation. Veuillez utiliser notre formulaire de contact ci-dessous.");
        setIsLoading(false);
        setWidgetStatus('fallback');
        toast({
          title: "Erreur de chargement",
          description: "Nous n'avons pas pu charger l'outil d'estimation. Vous pouvez nous contacter directement.",
          variant: "destructive"
        });
      }
    };
    
    // Ajout du script au head du document
    document.head.appendChild(script);
  };
  
  // Charger le widget uniquement lorsque la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      loadEstimationWidget();
    } else {
      cleanup();
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen]);
  
  const handleRefresh = () => {
    loadAttempts.current = 0;
    loadEstimationWidget();
  };
  
  // Formulaire de secours en cas d'échec du widget
  const renderFallbackForm = () => {
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
  
  return (
    <div className="relative w-full h-[600px] min-h-[600px] overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-sable-30/30 rounded-lg z-10">
          <Loader2 className="h-8 w-8 text-cuivre animate-spin mb-2" />
          <p className="text-anthracite font-medium">Chargement de l'outil d'estimation...</p>
        </div>
      )}
      
      {scriptError && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{scriptError}</p>
          <Button 
            onClick={handleRefresh}
            className="bg-cuivre hover:bg-sable-80 text-white font-medium"
          >
            Réessayer
          </Button>
        </div>
      )}
      
      {/* Zone de conteneur pour le widget */}
      <div id="widget-container-area" className="w-full h-full min-h-[600px]">
        <div id={WIDGET_CONTAINER_ID} className="w-full h-full min-h-[600px]"></div>
      </div>
      
      {/* Formulaire de secours */}
      {widgetStatus === 'fallback' && renderFallbackForm()}
    </div>
  );
};

const Estimation: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
                        <EstimationWidget isOpen={dialogOpen} />
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
