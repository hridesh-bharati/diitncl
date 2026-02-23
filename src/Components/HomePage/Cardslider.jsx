import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function CardSlider() {

  const base = "images/cardslider";

  const slides = [
    "android.avif","ehack.avif","cpp.avif","office.avif",
    "js.avif","coding.avif","ai.avif","tail.avif",
    "ppt.avif","python.avif","ai1.avif","ps1.avif",
  ];

  return (
    <div className="py-3">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 1800, disableOnInteraction: false }}
        spaceBetween={15}
        grabCursor={true}

        breakpoints={{
          320: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          768: { slidesPerView: 5 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 9 },
        }}

        className="card-slider pb-5"
      >
        {slides.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="slide-box">
              <img
                src={`${base}/${img}`}
                alt={img.replace(".avif", "")}
                loading="lazy"
                decoding="async"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .slide-box {
          height: 130px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 14px rgba(0,0,0,0.08);
          transition: 0.3s ease;
          background: #fff;
        }

        .slide-box:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }

        .slide-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .swiper-pagination-bullet {
          width: 18px;
          height: 6px;
          border-radius: 6px;
          background: #001297;
        }
      `}</style>
    </div>
  );
}