
import React from "react";
import TeamMember, { TeamMemberProps } from "./TeamMember";
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
      <section className="py-12">
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          <Separator className="w-24 h-0.5 bg-gold/30 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-cream border-gold/20 rounded-lg p-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
                <Skeleton className="h-4 w-24 mt-2" />
                <div className="flex gap-3 mt-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-playfair font-light text-gold mb-4">
            Notre Équipe
          </h2>
          <p className="text-red-500">
            Une erreur est survenue lors du chargement des informations de l'équipe.
          </p>
          <Separator className="w-24 h-0.5 bg-gold/30 mx-auto mt-6" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" id="notre-equipe">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-playfair font-light text-gold mb-4">
          Notre Équipe
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Une équipe de professionnels <span className="font-medium">spécialisés dans l'immobilier</span> de luxe sur la Côte d'Azur, à votre service pour tous vos projets.
        </p>
        {isFromWordPress && (
          <p className="text-xs text-gray-400 mt-2">
            Informations synchronisées avec le site WordPress
          </p>
        )}
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
