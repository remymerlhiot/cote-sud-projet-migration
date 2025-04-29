
import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomWordPressPage from "@/components/CustomWordPressPage";
import { Skeleton } from "@/components/ui/skeleton";

interface DynamicPageProps {
  slug?: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slug: propSlug }) => {
  // Get the slug from the URL parameters or from props
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug;
  
  return (
    <div className="flex flex-col min-h-screen bg-cream font-raleway">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        {!slug ? (
          <div className="text-center p-8 text-gold">Page introuvable</div>
        ) : (
          <CustomWordPressPage 
            slug={slug} 
            cleaningOptions={{
              removeElementorClasses: true,
              simplifyStructure: true, 
              makeImagesResponsive: true,
              fixLinks: true,
              baseDomain: "https://cote-sud.immo"
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DynamicPage;
