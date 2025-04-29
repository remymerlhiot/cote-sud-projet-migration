
import React, { useMemo } from "react";
import { useCustomPage } from "@/hooks/useCustomPage";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanElementorHtml, CleaningOptions } from "@/utils/elementorCleaner";

interface CustomWordPressPageProps {
  slug: string;
  className?: string;
  showTitle?: boolean;
  cleaningOptions?: CleaningOptions;
  extractSection?: string;
}

const CustomWordPressPage: React.FC<CustomWordPressPageProps> = ({ 
  slug, 
  className = "",
  showTitle = true,
  cleaningOptions,
  extractSection
}) => {
  const { data: page, isLoading, isError } = useCustomPage(slug);

  // Process and clean the HTML content
  const processedContent = useMemo(() => {
    if (!page?.content) return "";
    
    let content = page.content;
    
    // Clean the Elementor HTML
    content = cleanElementorHtml(content, cleaningOptions);
    
    // Extract specific section if requested
    if (extractSection) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const section = doc.querySelector(extractSection);
      
      if (section) {
        return section.innerHTML;
      } else {
        // If specific section not found, try to find it in the elementor_data
        const elementorDoc = page.elementor_data ? 
          parser.parseFromString(`<div>${page.elementor_data}</div>`, "text/html") : null;
        
        const elementorSection = elementorDoc?.querySelector(extractSection);
        return elementorSection ? elementorSection.innerHTML : content;
      }
    }
    
    return content;
  }, [page, cleaningOptions, extractSection]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showTitle && <Skeleton className="h-12 w-3/4" />}
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center p-8 text-red-500">Erreur lors du chargement de la page</div>;
  }

  if (!page) {
    return <div className="text-center p-8 text-[#CD9B59]">Page introuvable</div>;
  }

  return (
    <div className={`wordpress-page ${className}`}>
      {showTitle && (
        <h1 className="text-3xl font-playfair font-light text-[#CD9B59] mb-6">
          {page.title}
        </h1>
      )}
      
      {page.featured_image && (
        <div className="featured-image mb-8">
          <img 
            src={page.featured_image} 
            alt={page.title} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div 
        className="page-content prose max-w-none prose-headings:text-gold prose-headings:font-playfair prose-headings:font-light font-raleway elementor-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      
      {page.media_list && page.media_list.length > 0 && (
        <div className="media-gallery mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {page.media_list.map((imageUrl, index) => (
            <div key={index} className="media-item">
              <img 
                src={imageUrl} 
                alt={`Media ${index + 1} - ${page.title}`} 
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomWordPressPage;
