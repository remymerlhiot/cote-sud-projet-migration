
import React, { useMemo } from "react";
import { usePageBySlug } from "@/hooks/useWordPress";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanElementorHtml, CleaningOptions } from "@/utils/elementorCleaner";
import { Separator } from "@/components/ui/separator";

interface WordPressPageProps {
  slug: string;
  className?: string;
  showTitle?: boolean;
  cleaningOptions?: CleaningOptions;
  extractSection?: string;
  hideErrorMessages?: boolean;
}

const WordPressPage: React.FC<WordPressPageProps> = ({ 
  slug, 
  className = "",
  showTitle = true,
  cleaningOptions,
  extractSection,
  hideErrorMessages = false
}) => {
  const { data: page, isLoading, isError } = usePageBySlug(slug);

  // Process and clean the HTML content
  const processedContent = useMemo(() => {
    if (!page?.content?.rendered) return "";
    
    let content = page.content.rendered;
    
    // Clean the Elementor HTML
    content = cleanElementorHtml(content, cleaningOptions);
    
    // Extract specific section if requested
    if (extractSection) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const section = doc.querySelector(extractSection);
      content = section ? section.innerHTML : content;
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

  if (isError && !hideErrorMessages) {
    return <div className="text-center p-8 text-red-500">Erreur lors du chargement de la page</div>;
  }

  if (!page && !hideErrorMessages) {
    return <div className="text-center p-8 text-sable">Page introuvable</div>;
  }
  
  if (!page && hideErrorMessages) {
    return null;
  }

  return (
    <div className={`wordpress-page ${className}`}>
      {showTitle && page && (
        <>
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-sable text-center mb-6"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
          <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mb-12" />
        </>
      )}
      
      {page?.featured_media_url && (
        <div className="featured-image mb-8">
          <img 
            src={page.featured_media_url} 
            alt={page.title.rendered} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      {page && (
        <div 
          className="page-content prose max-w-none prose-headings:text-sable prose-headings:font-light elementor-content"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      )}
    </div>
  );
};

export default WordPressPage;
