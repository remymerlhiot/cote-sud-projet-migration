import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Props = { images: string[]; title: string };

export default function PropertyCarousel({ images, title }: Props) {
  return (
    <Swiper spaceBetween={8} slidesPerView={1}>
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img
            src={src}
            alt={`${title} – photo ${i + 1}`}
            className="w-full h-64 object-cover rounded"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
