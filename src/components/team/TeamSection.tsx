
import React from "react";
import TeamMember, { TeamMemberProps } from "./TeamMember";
import { Separator } from "@/components/ui/separator";

// Sample team data - in a real application, this might come from an API
const teamMembers: TeamMemberProps[] = [
  {
    name: "Marie Dupont",
    phone: "06 12 34 56 78",
    email: "marie@cotesud.fr",
    role: "Directrice",
    imageUrl: "/lovable-uploads/da965f9f-a5aa-421e-adf5-296c06a90881.png",
  },
  {
    name: "Pierre Martin",
    phone: "06 23 45 67 89",
    email: "pierre@cotesud.fr",
    linkedin: "https://linkedin.com/in/example",
    role: "Agent immobilier",
    imageUrl: "/lovable-uploads/97689347-4c31-4d84-bcba-5f3e6f50b63e.png",
  },
  {
    name: "Sophie Leclerc",
    phone: "06 34 56 78 90",
    email: "sophie@cotesud.fr",
    role: "Conseillère",
    imageUrl: "/lovable-uploads/7eaefbd9-2a14-4bcd-959b-139a0bac5c99.png",
  },
  {
    name: "Jean Moreau",
    phone: "06 45 67 89 01",
    email: "jean@cotesud.fr",
    role: "Expert immobilier",
    imageUrl: "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png",
  },
];

const TeamSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-playfair font-light text-gold mb-4">
          Notre Équipe
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Une équipe de professionnels <span className="font-medium">spécialisés dans l'immobilier</span> de luxe sur la Côte d'Azur, à votre service pour tous vos projets.
        </p>
        <Separator className="w-24 h-0.5 bg-gold/30 mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
