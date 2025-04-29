
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useLocation } from "react-router-dom";
import { Phone, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="relative">
      <div className="relative h-[400px] md:h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png)` }}>
        <div className="absolute inset-0 bg-black/30">
          {/* Logo */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h1 className="text-7xl font-light text-[#CD9B59] font-playfair">AXO</h1>
            <p className="text-[#CD9B59] italic font-playfair mt-1">Côté Sud</p>
            <p className="text-white mt-1 tracking-[0.25em] font-raleway text-sm">PRESTIGE & PATRIMOINE</p>
          </div>
          
          {/* Navigation Menu */}
          <div className="absolute top-20 left-0 right-0 w-full">
            <div className="container mx-auto">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="flex justify-center w-full space-x-4 py-3 mx-auto">
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/" 
                      className={`text-white hover:text-[#CD9B59] uppercase text-xs font-medium px-2 ${isActive('/') ? 'text-[#CD9B59]' : ''}`}
                    >
                      Accueil
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/notre-histoire" 
                      className={`text-white hover:text-[#CD9B59] uppercase text-xs font-medium px-2 ${isActive('/notre-histoire') ? 'text-[#CD9B59]' : ''}`}
                    >
                      Notre Histoire
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/nos-biens" 
                      className={`text-white hover:text-[#CD9B59] uppercase text-xs font-medium px-2 ${isActive('/nos-biens') ? 'text-[#CD9B59]' : ''}`}
                    >
                      Nos Biens
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/estimation" 
                      className={`text-white hover:text-[#CD9B59] uppercase text-xs font-medium px-2 ${isActive('/estimation') ? 'text-[#CD9B59]' : ''}`}
                    >
                      Estimation
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/partenaires" 
                      className={`text-white hover:text-[#CD9B59] uppercase text-xs font-medium px-2 ${isActive('/partenaires') ? 'text-[#CD9B59]' : ''}`}
                    >
                      Partenaires
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink 
                      href="/nos-avis" 
                      className={`text-white hover:text-[#CD9B59] uppercase text-xs font-medium px-2 ${isActive('/nos-avis') ? 'text-[#CD9B59]' : ''}`}
                    >
                      Nos Avis
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          
          {/* Contact Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 border-t border-b border-[#CD9B59]/30">
            <div className="container mx-auto flex justify-center items-center gap-12 text-xs">
              <div className="flex items-center gap-1 text-white">
                <Home size={14} className="text-[#CD9B59]" />
                <span>REJOIGNEZ-NOUS</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Phone size={14} className="text-[#CD9B59]" />
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
