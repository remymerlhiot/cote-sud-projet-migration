
import React from "react";
import TeamMember from "./TeamMember";
import { Separator } from "@/components/ui/separator";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";

const TeamSection: React.FC = () => {
  // Use our custom hook to get team members from WordPress
  const { teamMembers, isLoading, isError, isFromWordPress } = useTeamMembers();

  // Display a toast if we loaded from WordPress
  React.useEffect(() => {
    if (isFromWordPress) {
      toast.success("Membres de l'équipe synchronisés depuis WordPress");
    }
  }, [isFromWordPress]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-sable-30">
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 max-w-7xl mx-auto px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-6 w-32 mt-4" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-12 bg-sable-30">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-cuivre mb-6">
            Notre Équipe
          </h2>
          <p className="text-red-500">
            Une erreur est survenue lors du chargement des informations de l'équipe.
          </p>
          <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mt-6" />
        </div>
      </section>
    );
  }

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
            <TeamMember 
              key={index} 
              {...member}
              // Positions par défaut pour l'exemple - en production, ces valeurs viendraient des données
              imagePosition={index % 2 === 0 ? "center" : index % 3 === 0 ? "top" : "center bottom"}
              imageSize={index % 3 === 0 ? "large" : index % 4 === 0 ? "small" : "medium"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
