import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PropertyCarouselProps {
  images: string[];
  title: string;
}

// Logo AXO Côté Sud (fallback si aucune image dispo)
const fallbackImage = "https://cote-sud.immo/wp-content/uploads/2024/10/AXO_COTE-SUD_PRESTIGE-PATRIMOINE_SABLE-CUIVRE-SABLE-2-768x400.png";

export default function PropertyCarousel({ images, title }: PropertyCarouselProps) {
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]); // Initialisé vide
  const [swiper, setSwiper] = useState<any>(null);

  const displayImages = images.length > 0 ? images : [fallbackImage];

  // Recrée le tableau des images chargées quand les images changent
  useEffect(() => {
    setImagesLoaded(Array(displayImages.length).fill(false));
  }, [displayImages]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Erreur de chargement image [${index}]:`, displayImages[index]);
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = fallbackImage;
    handleImageLoad(index);
  };

  return (
    <div className="relative">
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
      >
        {displayImages.map((src, i) => (
          <SwiperSlide key={i} className="w-full h-full relative">
            {!imagesLoaded[i] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-solid border-t-transparent border-[#C8A977]" />
              </div>
            )}
            <img
              src={src}
              alt={`${title} – photo ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onLoad={() => handleImageLoad(i)}
              onError={(e) => handleImageError(i, e)}
              style={{ display: imagesLoaded[i] ? "block" : "none" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {displayImages.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                swiper?.realIndex === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => swiper?.slideTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
