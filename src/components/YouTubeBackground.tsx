
import { useEffect, useRef } from 'react';

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
  
  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    let player: any;

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('youtube-background', {
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
            // Si une valeur endTime est définie, vérifier si nous avons atteint cette limite
            if (endTime && player) {
              // Vérifier périodiquement la position de lecture
              const checkTimeInterval = setInterval(() => {
                const currentTime = player.getCurrentTime();
                if (currentTime >= endTime) {
                  // Revenir au début de la séquence (startTime)
                  player.seekTo(startTime);
                }
              }, 1000); // Vérifier chaque seconde
              
              // Nettoyer l'intervalle à la destruction du composant
              return () => clearInterval(checkTimeInterval);
            }
            
            // Replay video when it ends if no endTime is set
            if (!endTime && event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(startTime);
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
  }, [videoId, startTime, endTime]);

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
          className="absolute w-[300%] h-[300%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
