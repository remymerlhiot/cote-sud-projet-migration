
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
  const [swiper, setSwiper] = useState<any>(null);
  
  // Utiliser une image par défaut si aucune image n'est disponible
  const displayImages = images.length > 0 
    ? images 
    : ["/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png"];

  return (
    <div className="relative">
      <Swiper
        onSwiper={setSwiper}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-[400px] md:h-[500px] rounded-md overflow-hidden"
      >
        {displayImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image} 
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
              }}
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
