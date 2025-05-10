
import React from "react";
import TeamCardStatic from "./TeamCardStatic";
import { Separator } from "@/components/ui/separator";
import { teamMembers } from "@/data/teamMembers";

const TeamSectionStatic: React.FC = () => {
  return (
    <section className="py-12 bg-sable-30" id="notre-equipe">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-cuivre mb-6">
            Notre Équipe
          </h2>
          <Separator className="w-24 h-0.5 bg-sable mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamCardStatic 
              key={index} 
              {...member}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSectionStatic;
