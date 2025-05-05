
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Linkedin } from "lucide-react";

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
  linkedin,
  imageUrl,
  role,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="bg-cream border-gold/20 hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 border-2 border-gold mb-4">
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-gold/10 text-gold text-lg">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>

        <h3 className="font-playfair text-xl text-gold mb-1">{name}</h3>
        
        {role && (
          <p className="text-sm text-gray-600 mb-3">{role}</p>
        )}

        <div className="flex items-center justify-center gap-3 mt-3">
          <a 
            href={`tel:${phone.replace(/\s/g, '')}`} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
            title={phone}
          >
            <Phone className="h-4 w-4 text-gold" />
          </a>
          
          {email && (
            <a 
              href={`mailto:${email}`} 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
              title={email}
            >
              <Mail className="h-4 w-4 text-gold" />
            </a>
          )}
          
          {linkedin && (
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4 text-gold" />
            </a>
          )}
        </div>
        
        <p className="mt-2 text-sm font-medium">{phone}</p>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
