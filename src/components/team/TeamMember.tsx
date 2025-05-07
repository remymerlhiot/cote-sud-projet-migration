
import React from "react";

export interface TeamMemberProps {
  name: string;
  phone: string;
  email?: string;
  linkedin?: string;
  imageUrl?: string;
  role?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  phone,
  email,
  imageUrl,
  role,
}) => {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="relative w-48 h-48 overflow-hidden rounded-full mb-4 bg-cream border-gold/10">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gold/10 text-gold">
            {name.split(" ").map(n => n[0]).join("")}
          </div>
        )}
      </div>

      <h3 className="font-playfair text-xl text-gold uppercase mb-2">{name}</h3>
      {role && <p className="text-sm text-gray-600 mb-1">{role}</p>}
      <p className="text-sm">{phone}</p>
      {email && <p className="text-sm text-gray-600">{email}</p>}
    </div>
  );
};

export default TeamMember;
