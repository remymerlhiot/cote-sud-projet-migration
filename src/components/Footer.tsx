
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#3c3c3c] text-[#CD9B59] pt-12 pb-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <img 
            src="https://cote-sud.immo/wp-content/uploads/2024/10/AXO_COTE-SUD_PRESTIGE-PATRIMOINE_SABLE-CUIVRE-SABLE-2-768x400.png" 
            alt="AXO Côté Sud" 
            className="h-16 md:h-20 mb-6"
          />
          
          <div className="flex gap-4 mt-4">
            <a href="https://www.facebook.com/axocotesud" className="text-[#CD9B59] hover:text-white" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.google.com/search?q=axo+cote+sud" className="text-[#CD9B59] hover:text-white" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">Google</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/axo-cote-sud" className="text-[#CD9B59] hover:text-white" target="_blank" rel="noopener noreferrer">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xs uppercase mb-2">AGENCE AIX EN PROVENCE</h3>
            <p className="text-xs text-white">En haut du cours Mirabeau</p>
            <p className="text-xs text-white">Place Ganay</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xs uppercase mb-2">CONTACTEZ-NOUS PAR MAIL</h3>
            <a href="mailto:cote-sud@axo.immo" className="text-xs text-white hover:text-[#CD9B59]">cote-sud@axo.immo</a>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-xs uppercase mb-2">PAR TÉLÉPHONE</h3>
            <p className="text-xs text-white">06 14 84 80 35</p>
          </div>
        </div>
        
        <div className="border-t border-[#CD9B59]/30 mt-8 pt-6 text-[10px] text-center text-white">
          <p>© 2024 - Axo L'immobilier Actif - Tous droits réservés</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="text-white hover:text-[#CD9B59]">Mentions légales</a>
            <span className="text-[#CD9B59]">|</span>
            <a href="#" className="text-white hover:text-[#CD9B59]">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
