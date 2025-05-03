
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useLocation } from "react-router-dom";
import { Home, Phone } from "lucide-react";
import YouTubeBackground from "./YouTubeBackground";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // ID de la nouvelle vidéo YouTube avec paramètres de début et fin
  const youtubeVideoId = "-Ck0w7BZAbs";
  const startTime = 8; // Démarrer à 8 secondes
  const endTime = 60; // Terminer à 60 secondes

  return (
    <header className="relative">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* YouTube Video Background avec les nouveaux paramètres */}
        <YouTubeBackground 
          videoId={youtubeVideoId}
          startTime={startTime}
          endTime={endTime}
          overlayColor="#B17226"
          overlayOpacity={0.36}
        />
        
        <div className="absolute inset-0">
          {/* Logo */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <img alt="AXO Côté Sud" className="h-24 w-auto mb-2" src="/lovable-uploads/97689347-4c31-4d84-bcba-5f3e6f50b63e.png" />
            <p className="text-white mt-1 tracking-[0.25em] font-raleway text-sm">PRESTIGE & PATRIMOINE</p>
          </div>
          
          {/* Navigation Menu - Centered and uniform */}
          <div className="absolute bottom-24 left-0 right-0 w-full">
            <div className="container mx-auto">
              <div className="flex justify-center">
                <div className="bg-[#CD9B59]/30 backdrop-blur-sm">
                  <NavigationMenu className="w-full">
                    <NavigationMenuList className="flex justify-center w-full space-x-0 mx-auto">
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          href="/" 
                          className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-6 py-3 transition-colors
                          ${isActive('/') ? 'bg-[#CD9B59]' : ''}`}
                        >
                          Accueil
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          href="/notre-histoire" 
                          className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-6 py-3 transition-colors
                          ${isActive('/notre-histoire') ? 'bg-[#CD9B59]' : ''}`}
                        >
                          Notre Histoire
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          href="/nos-biens" 
                          className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-6 py-3 transition-colors
                          ${isActive('/nos-biens') ? 'bg-[#CD9B59]' : ''}`}
                        >
                          Nos Biens
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          href="/estimation" 
                          className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-6 py-3 transition-colors
                          ${isActive('/estimation') ? 'bg-[#CD9B59]' : ''}`}
                        >
                          Estimation
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          href="/partenaires" 
                          className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-6 py-3 transition-colors
                          ${isActive('/partenaires') ? 'bg-[#CD9B59]' : ''}`}
                        >
                          Partenaires
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          href="/nos-avis" 
                          className={`text-white hover:bg-[#CD9B59] uppercase text-xs font-medium px-6 py-3 transition-colors
                          ${isActive('/nos-avis') ? 'bg-[#CD9B59]' : ''}`}
                        >
                          Nos Avis
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Bar */}
          <div className="absolute bottom-8 left-0 right-0 py-2">
            <div className="container mx-auto flex justify-center items-center gap-12 text-xs">
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
    </header>
  );
};

export default Header;
