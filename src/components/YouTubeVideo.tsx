
import { useEffect, useRef, useState } from 'react';

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  showControls?: boolean;
  autoplay?: boolean;
}

const YouTubeVideo = ({ 
  videoId, 
  title = "YouTube video", 
  className = "", 
  aspectRatio = "16:9",
  showControls = true,
  autoplay = false
}: YouTubeVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch(aspectRatio) {
      case "4:3": return "aspect-[4/3]";
      case "1:1": return "aspect-square";
      default: return "aspect-video"; // 16:9
    }
  };
  
  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    const onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return;
      
      const videoContainer = containerRef.current.querySelector('.youtube-video-container');
      
      if (!videoContainer) return;
      
      playerRef.current = new window.YT.Player(videoContainer, {
        videoId: videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: showControls ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => setIsLoaded(true)
        }
      });
    };
    
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // Set up callback for when API loads
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      // Clean up
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, autoplay, showControls]);

  return (
    <div ref={containerRef} className={`overflow-hidden rounded-lg shadow-md ${className}`}>
      <div className={`relative ${getAspectRatioClass()} bg-black/10`}>
        <div 
          className="youtube-video-container absolute inset-0 w-full h-full"
          title={title}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 border-4 border-sable border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeVideo;
