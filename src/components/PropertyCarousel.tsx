import { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PropertyCarouselProps {
  images: string[];
  title: string;
}

export default function PropertyCarousel({ images, title }: PropertyCarouselProps) {
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [swiper, setSwiper] = useState<any>(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fallback =
    "https://cote-sud.immo/wp-content/uploads/2024/10/AXO_COTE-SUD_PRESTIGE-PATRIMOINE_SABLE-CUIVRE-SABLE-2-768x400.png";

  // Filtrer les images valides
  const validImages = images.filter(img => 
    img && typeof img === 'string' && img.startsWith('http')
  );
  
  const displayImages = validImages.length > 0 ? validImages : [fallback];

  // Fonction pour précharger les images
  const preloadImages = useCallback(() => {
    console.log("🖼️ Préchargement de", displayImages.length, "images");
    
    // Réinitialiser les images chargées
    setImagesLoaded(Array(displayImages.length).fill(false));
    setLoadingProgress(0);
    setLoadingImages(true);
    
    let loadedCount = 0;
    
    // Préchargement des images
    const imagePromises = displayImages.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          const newImagesLoaded = [...imagesLoaded];
          newImagesLoaded[index] = true;
          setImagesLoaded(newImagesLoaded);
          setLoadingProgress(Math.floor((loadedCount / displayImages.length) * 100));
          resolve();
        };
        img.onerror = () => {
          console.log(`❌ Erreur de préchargement à l'index ${index}:`, src);
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / displayImages.length) * 100));
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setLoadingImages(false);
        console.log("✅ Préchargement terminé !");
      })
      .catch(err => {
        console.error("Erreur lors du préchargement des images:", err);
        setLoadingImages(false);
      });
  }, [displayImages, imagesLoaded]); 

  useEffect(() => {
    // Lancer le préchargement lors du chargement initial ou du changement d'images
    preloadImages();
  }, [displayImages.length, preloadImages]);

  const handleImageLoad = (index: number) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
  };

  const handleImageError = (
    index: number,
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log(`❌ Erreur de chargement à l'index ${index}:`, displayImages[index]);
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = fallback;
    handleImageLoad(index);
  };

  console.log("🖼️ Images reçues par le carousel :", images.length, "images");
  
  // Si aucune image, afficher un message
  if (displayImages.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Logging pour debug */}
      {console.log(`Rendering carousel with ${displayImages.length} images`)}
      
      {/* Indicateur de chargement global */}
      {loadingImages && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-30 rounded-md">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-t-transparent border-[#C8A977] mb-4" />
          <p className="text-[#C8A977]">Chargement des images... {loadingProgress}%</p>
        </div>
      )}
      
      <Swiper
        onSwiper={setSwiper}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={displayImages.length > 1}
        className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden"
        touchEventsTarget="container"
        simulateTouch={true}
        threshold={5}
        initialSlide={0}
        preloadImages={true}
        updateOnImagesReady={true}
      >
        {displayImages.map((src, i) => (
          <SwiperSlide key={`slide-${i}-${src.substring(src.lastIndexOf('/') + 1)}`} className="w-full h-full relative">
            {(!imagesLoaded[i]) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-solid border-t-transparent border-[#C8A977]" />
              </div>
            )}
            <img
              src={src}
              alt={`${title} – photo ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              onLoad={() => handleImageLoad(i)}
              onError={(e) => handleImageError(i, e)}
              style={{ 
                display: "block"
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Indicateurs */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                swiper?.activeIndex === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => swiper?.slideTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}