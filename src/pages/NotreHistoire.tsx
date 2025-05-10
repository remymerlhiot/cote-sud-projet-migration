
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomWordPressPage from "@/components/CustomWordPressPage";
import { useNotreHistoire } from "@/hooks/useNotreHistoire";
import { Skeleton } from "@/components/ui/skeleton";
import TeamSection from "@/components/team/TeamSection";
import HistoryIntroSection from "@/components/history/HistoryIntroSection";

interface NotreHistoireProps {
  slug?: string;
}

const NotreHistoire: React.FC<NotreHistoireProps> = ({
  slug: propSlug
}) => {
  // Use our custom hooks
  const {
    data: page,
    isLoading,
    isError
  } = useNotreHistoire(propSlug);

  return (
    <div className="flex flex-col min-h-screen bg-cream font-raleway">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <div>
          {isLoading && (
            <div className="space-y-6 container mx-auto px-4 py-12">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          )}
          
          {!isLoading && (
            <>
              {/* Add our new HistoryIntroSection component */}
              <HistoryIntroSection 
                imageUrl={page?.featured_image || "https://cote-sud.immo/wp-content/uploads/2024/11/maison-cezanne.png"} 
                title="Notre Histoire" 
                description="Côté Sud Immobilier vous accompagne dans tous vos projets immobiliers depuis plus de 15 ans. Notre expertise du marché local et notre connaissance approfondie de la région nous permettent de vous offrir un service personnalisé et de qualité. Notre équipe de professionnels est à votre écoute pour vous guider dans votre recherche et vous accompagner jusqu'à la concrétisation de votre projet." 
              />
              
              {/* Add our custom TeamSection component */}
              <TeamSection />
              
              {/* Hidden WordPress content */}
              <div className="hidden">
                <CustomWordPressPage 
                  slug={propSlug || "notre-histoire"} 
                  className="prose-headings:text-gold prose-headings:font-playfair prose-headings:font-light" 
                  hideTeamSection={true}  // Hide the WordPress team section
                  styleTeamSection={false} // Don't try to style it since we're hiding it
                  hideContent={true} // Hide the content block as requested
                  cleaningOptions={{
                    removeElementorClasses: true,
                    simplifyStructure: true,
                    makeImagesResponsive: true,
                    fixLinks: true,
                    baseDomain: "https://cote-sud.immo"
                  }} 
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotreHistoire;
