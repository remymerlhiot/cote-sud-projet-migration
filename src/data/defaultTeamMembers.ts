
import { TeamMemberProps } from "@/components/team/TeamMember";

/**
 * Default/fallback team members to use when WordPress data isn't available
 */
export const defaultTeamMembers: TeamMemberProps[] = [
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
