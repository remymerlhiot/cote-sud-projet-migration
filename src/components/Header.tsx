import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useLocation } from "react-router-dom";
import { Home, Phone, Menu, X } from "lucide-react";
import YouTubeBackground from "./YouTubeBackground";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // ID de la nouvelle vidéo YouTube avec paramètres de début et fin
  const youtubeVideoId = "-Ck0w7BZAbs";
  const startTime = 8; // Démarrer à 8 secondes
  const endTime = 60; // Terminer à 60 secondes

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Navigation links used in both desktop and mobile menus
  const navigationLinks = [{
    path: "/",
    label: "Accueil"
  }, {
    path: "/notre-histoire",
    label: "Notre Histoire"
  }, {
    path: "/nos-biens",
    label: "Nos Biens"
  }, {
    path: "/estimation",
    label: "Estimation"
  }, {
    path: "/partenaires",
    label: "Partenaires"
  }, {
    path: "/nos-avis",
    label: "Nos Avis"
  }];

  // Mobile Menu Component
  const MobileMenu = () => <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden absolute top-4 right-4 z-50 bg-[#CD9B59]/80 p-2 rounded-md text-white" aria-label="Menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-anthracite w-[80%] p-0">
        <div className="pt-12 pb-6 px-4 flex flex-col h-full">
          <div className="flex justify-center mb-8">
            <img alt="AXO Côté Sud" className="h-16 w-auto" src="/lovable-uploads/97689347-4c31-4d84-bcba-5f3e6f50b63e.png" />
          </div>
          <nav className="flex-1">
            <ul className="flex flex-col space-y-1">
              {navigationLinks.map(link => <li key={link.path}>
                  <a href={link.path} className={`block py-3 px-4 text-white text-center uppercase font-medium transition-colors
                      ${isActive(link.path) ? 'bg-[#CD9B59]' : 'hover:bg-[#CD9B59]/50'}`}>
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </nav>
          <div className="mt-auto pt-6 border-t border-sable-30/20">
            <div className="flex flex-col items-center gap-4 text-sm text-white">
              <div className="flex items-center gap-2">
                <Home size={14} className="text-sable-30" />
                <span>REJOIGNEZ-NOUS</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-sable-30" />
                <span>06 09 08 04 98</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
  return <header className="relative">
      <div className="relative h-[240px] md:h-[280px] overflow-hidden">
        {/* YouTube Video Background avec les nouveaux paramètres */}
        <YouTubeBackground videoId={youtubeVideoId} startTime={startTime} endTime={endTime} overlayColor="#B17226" overlayOpacity={0.36} />
        
        <div className="absolute inset-0">
          {/* Logo */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <img alt="AXO Côté Sud" className="h-16 w-auto mb-2 md:h-24" src="https://cote-sud.immo/wp-content/uploads/2024/10/AXO_COTE-SUD_PRESTIGE-PATRIMOINE_SABLE-CUIVRE-SABLE-2-768x400.png" />
          </div>
          
          {/* Mobile Menu */}
          <MobileMenu />
          
          {/* Desktop Navigation Menu - Centered and uniform */}
          <div className="absolute bottom-8 left-0 right-0 w-full hidden md:block">
            <div className="container mx-auto">
              <div className="flex justify-center my-[15px]">
                <div className="bg-[#CD9B59]/30 backdrop-blur-sm">
                  <NavigationMenu className="w-full">
                    <NavigationMenuList className="flex justify-center w-full space-x-0 mx-auto">
                      {navigationLinks.map(link => <NavigationMenuItem key={link.path}>
                          <NavigationMenuLink href={link.path} className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-4 md:px-6 py-3 transition-colors
                            ${isActive(link.path) ? 'bg-[#CD9B59]' : ''}`}>
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>)}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Bar - Hidden on mobile */}
          <div className="absolute bottom-1 left-0 right-0 py-1 hidden md:block">
            <div className="container mx-auto flex justify-center items-center gap-8 md:gap-12 text-xs">
              <div className="flex items-center gap-2 text-white">
                <Home size={14} className="text-white" />
                <span>REJOIGNEZ-NOUS</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone size={14} className="text-white" />
                <span>06 09 08 04 98</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;