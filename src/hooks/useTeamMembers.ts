
import { useNotreHistoire } from "@/hooks/useNotreHistoire";
import { TeamMemberProps } from "@/components/team/TeamMember";
import { extractTeamMembersFromHTML } from "@/utils/teamMemberExtractor";
import { defaultTeamMembers } from "@/data/defaultTeamMembers";

/**
 * Custom hook to extract team members from WordPress content
 * Falls back to static data if WordPress content can't be parsed
 */
export const useTeamMembers = () => {
  // Fetch the WordPress page content
  const { data: page, isLoading, isError } = useNotreHistoire();
  
  // Process the page content to extract team members
  const processTeamMembers = (): { 
    teamMembers: TeamMemberProps[];
    isFromWordPress: boolean;
  } => {
    // If no page content, return fallback data
    if (!page?.content) {
      return { teamMembers: defaultTeamMembers, isFromWordPress: false };
    }
    
    try {
      // Try to extract team members from the WordPress content
      const membersFromPage = extractTeamMembersFromHTML(page.content);
      
      if (membersFromPage.length > 0) {
        console.log("Successfully extracted team members from WordPress content:", membersFromPage.length);
        return { teamMembers: membersFromPage, isFromWordPress: true };
      }
      
      // If we couldn't extract members, return fallback data
      console.log("Could not extract team members from WordPress content, using defaults");
      return { teamMembers: defaultTeamMembers, isFromWordPress: false };
      
    } catch (error) {
      console.error("Error processing team members:", error);
      return { teamMembers: defaultTeamMembers, isFromWordPress: false };
    }
  };
  
  // Return loading state, error state, and extracted team members
  const { teamMembers, isFromWordPress } = processTeamMembers();
  
  return {
    teamMembers,
    isFromWordPress,
    isLoading,
    isError
  };
};
