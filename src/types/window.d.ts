
// Add YouTube API declarations
interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT?: {
    Player: any;
  };
}
