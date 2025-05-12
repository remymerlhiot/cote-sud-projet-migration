
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTemplateImages } from "@/hooks/useTemplateImages";

type Props = { templateId: number; height?: number };

export default function TemplateCarousel({ templateId, height = 300 }: Props) {
  const { data: images = [], isLoading } = useTemplateImages(templateId);

  if (isLoading) return <p>Chargement…</p>;
  if (!images.length) return <p>Aucune image.</p>;

  return (
    <Swiper spaceBetween={8} slidesPerView={1}>
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img
            src={src}
            alt={`Visuel ${i + 1}`}
            className="w-full object-cover"
            style={{ height }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
