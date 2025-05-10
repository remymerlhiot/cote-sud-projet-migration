
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface YouTubeBackgroundProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  overlayColor?: string;
  overlayOpacity?: number;
}

const YouTubeBackground = ({ 
  videoId, 
  startTime = 0, 
  endTime, 
  overlayColor = "#000000", 
  overlayOpacity = 0.3 
}: YouTubeBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    let checkTimeInterval: NodeJS.Timeout | null = null;
    
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-background', {
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
            
            // Adjust size based on device
            updatePlayerSize();
          },
          onStateChange: (event) => {
            // Si une valeur endTime est définie, vérifier si nous avons atteint cette limite
            if (endTime && playerRef.current) {
              // Vérifier périodiquement la position de lecture
              checkTimeInterval = setInterval(() => {
                // Guard against null player reference
                if (!playerRef.current) return;
                
                try {
                  const currentTime = playerRef.current.getCurrentTime();
                  if (currentTime >= endTime) {
                    // Revenir au début de la séquence (startTime)
                    playerRef.current.seekTo(startTime);
                  }
                } catch (e) {
                  console.error("Error checking video time:", e);
                  // Clear the interval if there's an error
                  if (checkTimeInterval) {
                    clearInterval(checkTimeInterval);
                    checkTimeInterval = null;
                  }
                }
              }, 1000); // Vérifier chaque seconde
            }
            
            // Replay video when it ends if no endTime is set
            if (!endTime && event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(startTime);
              event.target.playVideo();
            }
            
            // Handle potential playback errors - Fix: check for specific state value instead of using UNSTARTED constant
            if (event.data === 0 || event.data === 5) { // 0=ENDED (already handled), 5=CUED
              setTimeout(() => {
                try {
                  event.target.playVideo();
                } catch (e) {
                  console.error("Failed to play video:", e);
                }
              }, 1000);
            }
          },
          onError: (event) => {
            console.error("YouTube player error:", event.data);
            // Try to recover from error
            setTimeout(() => {
              try {
                event.target.playVideo();
              } catch (e) {
                console.error("Failed to recover from error:", e);
              }
            }, 3000);
          }
        }
      });
    };
    
    // Update player size on window resize
    const handleResize = () => {
      updatePlayerSize();
    };
    
    window.addEventListener('resize', handleResize);

    // Function to update the player's size based on container dimensions
    const updatePlayerSize = () => {
      if (!containerRef.current || !playerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Calculate proper scaling factor for the video
      // Use a larger scale factor to ensure full coverage
      const scaleFactor = isMobile ? 4.0 : 3.5;
      
      try {
        playerRef.current.setSize(containerWidth * scaleFactor, containerHeight * scaleFactor);
      } catch (e) {
        console.error("Failed to resize player:", e);
      }
    };

    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = null;
      window.removeEventListener('resize', handleResize);
      
      if (checkTimeInterval) {
        clearInterval(checkTimeInterval);
      }
      
      // Clean up player reference
      playerRef.current = null;
    };
  }, [videoId, startTime, endTime, isMobile]);

  // Convertir l'opacité en valeur hexadécimale pour la couleur CSS
  const getHexOpacity = (opacity: number) => {
    // Convertir l'opacité (0-1) en valeur hexadécimale (00-FF)
    const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return hexOpacity;
  };

  // Créer la couleur de l'overlay avec opacité
  const overlayColorWithOpacity = `${overlayColor}${getHexOpacity(overlayOpacity)}`;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          id="youtube-background" 
          className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[3.5]"
        ></div>
      </div>
      {/* Overlay avec la couleur et l'opacité personnalisées */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: overlayColorWithOpacity }}
      ></div>
    </div>
  );
};

export default YouTubeBackground;
