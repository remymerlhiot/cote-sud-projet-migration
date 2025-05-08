
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
      <section className="py-12 bg-cream">
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-32 w-48 rounded-[50%/60%]" />
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
      <section className="py-12 bg-cream">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-sable mb-6">
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
    <section className="py-12 bg-cream" id="notre-equipe">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-normal text-sable mb-6">
          Notre Équipe
        </h2>
        <Separator className="w-24 h-0.5 bg-sable/30 mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 max-w-5xl mx-auto px-4">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
