
import { useEffect, useRef } from 'react';

interface YouTubeBackgroundProps {
  videoId: string;
  startTime?: number;
}

const YouTubeBackground = ({ videoId, startTime = 0 }: YouTubeBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-background', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          start: startTime,
          mute: 1
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event) => {
            // Replay video when it ends
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = null;
    };
  }, [videoId, startTime]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          id="youtube-background" 
          className="absolute w-[300%] h-[300%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
    </div>
  );
};

export default YouTubeBackground;
