
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomWordPressPage from "@/components/CustomWordPressPage";
import { useNotreHistoire } from "@/hooks/useNotreHistoire";
import { Skeleton } from "@/components/ui/skeleton";
import TeamSection from "@/components/team/TeamSection";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface NotreHistoireProps {
  slug?: string;
}

const NotreHistoire: React.FC<NotreHistoireProps> = ({ slug: propSlug }) => {
  // Use our custom hooks
  const { data: page, isLoading, isError } = useNotreHistoire(propSlug);
  const { isFromWordPress } = useTeamMembers();
  
  // Determine whether to show our custom TeamSection component
  // If team data is from WordPress, we'll use our custom TeamSection
  // component to display it in a standardized format
  
  return (
    <div className="flex flex-col min-h-screen bg-cream font-raleway">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <div className="space-y-6">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          )}
          
          {isError && (
            <div className="text-center p-8 text-red-500">
              Une erreur est survenue lors du chargement de la page
            </div>
          )}
          
          {!isLoading && !isError && !page && (
            <div className="text-center p-8 text-gold">
              <h1 className="text-3xl font-playfair font-light mb-4">Notre Histoire</h1>
              <p>Cette page n'est pas encore disponible.</p>
            </div>
          )}
          
          {page && (
            <CustomWordPressPage 
              slug={propSlug || "notre-histoire"} 
              className="prose-headings:text-gold prose-headings:font-playfair prose-headings:font-light"
              hideTeamSection={true} // Always hide WordPress team section
              cleaningOptions={{
                removeElementorClasses: true,
                simplifyStructure: true, 
                makeImagesResponsive: true,
                fixLinks: true,
                baseDomain: "https://cote-sud.immo"
              }}
            />
          )}
        </div>
        
        {/* Team Section - Will always use our custom component for consistency */}
        <div className="mt-16 max-w-6xl mx-auto">
          <TeamSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotreHistoire;
