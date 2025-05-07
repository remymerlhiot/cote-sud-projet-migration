import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomWordPressPage from "@/components/CustomWordPressPage";
import { useNotreHistoire } from "@/hooks/useNotreHistoire";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  const [debugMode, setDebugMode] = useState(false);
  return <div className="flex flex-col min-h-screen bg-cream font-raleway">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Debug toggle in development - toggle to help identify HTML structure issues */}
          {process.env.NODE_ENV === 'development' && <div className="mb-4 text-right">
              
            </div>}
          
          {isLoading && <div className="space-y-6">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>}
          
          {isError && <div className="text-center p-8 text-red-500">
              Une erreur est survenue lors du chargement de la page
            </div>}
          
          {!isLoading && !isError && !page && <div className="text-center p-8 text-gold">
              <h1 className="text-3xl font-playfair font-light mb-4">Notre Histoire</h1>
              <p>Cette page n'est pas encore disponible.</p>
            </div>}
          
          {page && <>
              <CustomWordPressPage slug={propSlug || "notre-histoire"} className="prose-headings:text-gold prose-headings:font-playfair prose-headings:font-light" hideTeamSection={true} // Hide the WordPress team section
          styleTeamSection={false} // Don't try to style it since we're hiding it
          hideContent={true} // Hide the content block as requested
          debugMode={debugMode} // Debug mode to help identify issues
          cleaningOptions={{
            removeElementorClasses: true,
            simplifyStructure: true,
            makeImagesResponsive: true,
            fixLinks: true,
            baseDomain: "https://cote-sud.immo"
          }} />
              
              {/* Add our new HistoryIntroSection component */}
              <HistoryIntroSection imageUrl={page.featured_image || "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png"} title="Notre Histoire" description="Côté Sud Immobilier vous accompagne dans tous vos projets immobiliers depuis plus de 15 ans. Notre expertise du marché local et notre connaissance approfondie de la région nous permettent de vous offrir un service personnalisé et de qualité. Notre équipe de professionnels est à votre écoute pour vous guider dans votre recherche et vous accompagner jusqu'à la concrétisation de votre projet." />
              
              {/* Add our custom TeamSection component */}
              <TeamSection />
            </>}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>;
};
export default NotreHistoire;