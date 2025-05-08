
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PartnerSectionProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  imageOnRight?: boolean;
  imageSrc: string;
  children: ReactNode;
}

const PartnerSection = ({
  title,
  subtitle,
  icon,
  imageOnRight = false,
  imageSrc,
  children
}: PartnerSectionProps) => {
  return (
    <div className="py-12 md:py-16">
      <div className={cn(
        "flex flex-col md:flex-row items-center gap-8 md:gap-12",
        imageOnRight ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        {/* Text content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {icon && <div className="w-6 h-6">{icon}</div>}
            <h3 className="text-2xl md:text-3xl font-playfair font-normal text-cuivre">
              {title}
            </h3>
          </div>
          <p className="text-lg md:text-xl text-anthracite mb-8">
            {subtitle}
          </p>
          <div className="text-anthracite">
            {children}
          </div>
        </div>
        
        {/* Image */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;
