
import React from "react";

export interface TeamCardStaticProps {
  name: string;
  phone: string;
  email?: string;
  role?: string;
  imageUrl: string;
  imagePosition?: string;
  imageSize?: "small" | "medium" | "large";
}

const TeamCardStatic: React.FC<TeamCardStaticProps> = ({
  name,
  phone,
  email,
  imageUrl,
  role,
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
      <div className={`relative ${getImageContainerSize()} overflow-hidden rounded-full mb-4 border-2 border-sable`}>
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-lg p-1">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover rounded-full" 
              style={{ objectPosition: imagePosition }}
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                e.currentTarget.src = "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sable-30 text-cuivre rounded-full">
              {name.split(" ").map(n => n[0]).join("")}
            </div>
          )}
        </div>
      </div>

      <h3 className="font-playfair text-xl text-cuivre mb-2">{name}</h3>
      {role && <p className="text-sm text-anthracite mb-1">{role}</p>}
      <p className="text-sm font-medium text-anthracite">{phone}</p>
      {email && <p className="text-sm text-anthracite">{email}</p>}
    </div>
  );
};

export default TeamCardStatic;
