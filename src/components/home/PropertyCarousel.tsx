
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";

type Props = { images: string[]; title: string };

export default function PropertyCarousel({ images, title }: Props) {
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(Array(images.length).fill(false));

  const handleImageLoad = (index: number) => {
    const newImagesLoaded = [...imagesLoaded];
    newImagesLoaded[index] = true;
    setImagesLoaded(newImagesLoaded);
  };

  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Image loading error at index ${index}`);
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/lovable-uploads/fb5d6ada-8792-4e04-841d-2d9f6f6d9b39.png";
    handleImageLoad(index);
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={8}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        loop={images.length > 1}
        className="rounded-md overflow-hidden"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i} className="w-full h-[400px] relative">
            {!imagesLoaded[i] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-solid border-t-transparent border-[#C8A977]" />
              </div>
            )}
            <img
              src={src}
              alt={`${title} – photo ${i + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(i)}
              onError={(e) => handleImageError(i, e)}
              style={{ display: imagesLoaded[i] ? "block" : "none" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
