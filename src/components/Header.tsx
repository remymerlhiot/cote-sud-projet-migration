
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useLocation } from "react-router-dom";
import { Home, Phone } from "lucide-react";
import YouTubeBackground from "./YouTubeBackground";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Vous pouvez changer l'ID de la vidéo YouTube ici
  const youtubeVideoId = "TgOm5yiEZQU"; // Exemple d'ID de vidéo YouTube

  return (
    <header className="relative">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* YouTube Video Background */}
        <YouTubeBackground videoId={youtubeVideoId} />
        
        <div className="absolute inset-0">
          {/* Logo */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <img 
              src="/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png" 
              alt="AXO Côté Sud" 
              className="h-24 w-auto mb-2"
            />
            <p className="text-white mt-1 tracking-[0.25em] font-raleway text-sm">PRESTIGE & PATRIMOINE</p>
          </div>
          
          {/* Navigation Menu */}
          <div className="absolute bottom-24 left-0 right-0 w-full">
            <div className="container mx-auto">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="flex justify-center w-full space-x-1 py-3 mx-auto">
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/" 
                      className={`text-white hover:bg-[#CD9B59]/80 uppercase text-xs font-medium px-4 py-2 ${isActive('/') ? 'bg-[#CD9B59]/80' : ''}`}
                    >
                      Accueil
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/notre-histoire" 
                      className={`text-white hover:bg-[#CD9B59]/80 uppercase text-xs font-medium px-4 py-2 ${isActive('/notre-histoire') ? 'bg-[#CD9B59]/80' : ''}`}
                    >
                      Notre Histoire
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/nos-biens" 
                      className={`text-white hover:bg-[#CD9B59]/80 uppercase text-xs font-medium px-4 py-2 ${isActive('/nos-biens') ? 'bg-[#CD9B59]/80' : ''}`}
                    >
                      Nos Biens
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/estimation" 
                      className={`text-white hover:bg-[#CD9B59]/80 uppercase text-xs font-medium px-4 py-2 ${isActive('/estimation') ? 'bg-[#CD9B59]/80' : ''}`}
                    >
                      Estimation
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/partenaires" 
                      className={`text-white hover:bg-[#CD9B59]/80 uppercase text-xs font-medium px-4 py-2 ${isActive('/partenaires') ? 'bg-[#CD9B59]/80' : ''}`}
                    >
                      Partenaires
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/nos-avis" 
                      className={`text-white hover:bg-[#CD9B59]/80 uppercase text-xs font-medium px-4 py-2 ${isActive('/nos-avis') ? 'bg-[#CD9B59]/80' : ''}`}
                    >
                      Nos Avis
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          
          {/* Contact Bar */}
          <div className="absolute bottom-0 left-0 right-0 py-2">
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
