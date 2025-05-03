
import { API_BASE_URL } from "./config";
import { WordPressMedia } from "./types";

// Fetch media from WordPress API
export const fetchMedia = async (mediaId: number): Promise<WordPressMedia | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/${mediaId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching media: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch media #${mediaId}:`, error);
    return null;
  }
};
