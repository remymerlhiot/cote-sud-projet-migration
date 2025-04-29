
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Home, Phone } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="relative">
      <div className="relative h-[250px] md:h-[300px] bg-cover bg-center" style={{ backgroundImage: `url(/lovable-uploads/30ea6730-6ede-42e1-b81f-a08fea47e740.png)` }}>
        {/* Logo */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-6xl font-light text-[#CD9B59]">AXO</h1>
          <p className="text-[#CD9B59] italic mt-1">Côté Sud</p>
          <p className="text-white mt-1 tracking-widest">PRESTIGE & PATRIMOINE</p>
        </div>
        
        {/* Navigation Menu */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <div className="container mx-auto">
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex justify-center w-full space-x-8 py-3 border-t border-b border-[#CD9B59]/30">
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/" 
                    className={`text-white hover:text-[#CD9B59] uppercase text-sm font-medium ${isActive('/') ? 'text-[#CD9B59]' : ''}`}
                  >
                    Accueil
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/notre-histoire" 
                    className={`text-white hover:text-[#CD9B59] uppercase text-sm font-medium ${isActive('/notre-histoire') ? 'text-[#CD9B59]' : ''}`}
                  >
                    Notre Histoire
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/nos-biens" 
                    className={`text-white hover:text-[#CD9B59] uppercase text-sm font-medium ${isActive('/nos-biens') ? 'text-[#CD9B59]' : ''}`}
                  >
                    Nos Biens
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/estimation" 
                    className={`text-white hover:text-[#CD9B59] uppercase text-sm font-medium ${isActive('/estimation') ? 'text-[#CD9B59]' : ''}`}
                  >
                    Estimation
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/partenaires" 
                    className={`text-white hover:text-[#CD9B59] uppercase text-sm font-medium ${isActive('/partenaires') ? 'text-[#CD9B59]' : ''}`}
                  >
                    Partenaires
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/nos-avis" 
                    className={`text-white hover:text-[#CD9B59] uppercase text-sm font-medium ${isActive('/nos-avis') ? 'text-[#CD9B59]' : ''}`}
                  >
                    Nos Avis
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        {/* Contact Bar */}
        <div className="absolute bottom-[-40px] left-0 right-0 bg-[#1a1a1a]/80 py-2">
          <div className="container mx-auto flex justify-center md:justify-end items-center gap-8">
            <div className="flex items-center gap-2 text-white">
              <Home size={16} className="text-[#CD9B59]" />
              <span className="text-sm">REJOIGNEZ-NOUS</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Phone size={16} className="text-[#CD9B59]" />
              <span className="text-sm">06 09 08 04 98</span>
            </div>
          </div>
        </div>
      </div>
      {/* Add space to compensate for the contact bar */}
      <div className="h-[40px]"></div>
    </header>
  );
};

export default Header;
