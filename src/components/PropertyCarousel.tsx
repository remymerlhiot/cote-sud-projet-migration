
import { useState } from "react";
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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(Array(images.length).fill(false));
  const [swiper, setSwiper] = useState<any>(null);
  
  // Utiliser une image par défaut si aucune image n'est disponible
  const displayImages = images.length > 0 
    ? images 
    : ["/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"];

  const handleImageLoad = (index: number) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
  };

  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Image loading error at index ${index}:`, images[index]);
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
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
