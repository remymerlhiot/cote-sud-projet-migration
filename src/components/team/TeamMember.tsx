
import React from "react";

export interface TeamMemberProps {
  name: string;
  phone: string;
  email?: string;
  linkedin?: string;
  imageUrl?: string;
  role?: string;
  // Nouvelles propriétés pour le positionnement de l'image
  imagePosition?: string;  // Par exemple: "center", "top", "bottom", etc.
  imageSize?: "small" | "medium" | "large"; // Taille de l'image
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  phone,
  email,
  imageUrl,
  role,
  linkedin,
  imagePosition = "center",
  imageSize = "medium"
}) => {
  // Déterminer la taille de l'image en fonction de la propriété imageSize
  const getImageContainerSize = () => {
    switch (imageSize) {
      case "small": return "w-36 h-36";
      case "large": return "w-56 h-56";
      default: return "w-48 h-48"; // medium par défaut
    }
  };

  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className={`relative ${getImageContainerSize()} overflow-hidden rounded-full mb-4 bg-cream border-gold/10`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
            style={{ objectPosition: imagePosition }}
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.currentTarget.src = "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gold/10 text-gold">
            {name.split(" ").map(n => n[0]).join("")}
          </div>
        )}
      </div>

      <h3 className="font-playfair text-xl text-cuivre uppercase mb-2">{name}</h3>
      {role && <p className="text-sm text-anthracite mb-1">{role}</p>}
      <p className="text-sm font-medium">{phone}</p>
      {email && <p className="text-sm text-anthracite">{email}</p>}
      {linkedin && (
        <a 
          href={linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-2 inline-block text-xs text-cuivre hover:underline"
        >
          LinkedIn
        </a>
      )}
    </div>
  );
};

export default TeamMember;
