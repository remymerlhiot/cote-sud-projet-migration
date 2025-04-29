
import React from "react";
import { usePageBySlug } from "@/hooks/useWordPress";
import { Skeleton } from "@/components/ui/skeleton";

interface WordPressPageProps {
  slug: string;
  className?: string;
  showTitle?: boolean;
}

const WordPressPage: React.FC<WordPressPageProps> = ({ 
  slug, 
  className = "",
  showTitle = true 
}) => {
  const { data: page, isLoading, isError } = usePageBySlug(slug);

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
        <h1 
          className="text-3xl font-light text-[#CD9B59] mb-6"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
      )}
      
      {page.featured_media_url && (
        <div className="featured-image mb-8">
          <img 
            src={page.featured_media_url} 
            alt={page.title.rendered} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div 
        className="page-content prose max-w-none prose-headings:text-[#CD9B59] prose-headings:font-light"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </div>
  );
};

export default WordPressPage;
