import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import HomeSlide1 from "@/assets/Home-Slide-1.jpg";
import HomeSlide2 from "@/assets/Home-Slide-2.jpg";

const MySwiper = () => {
  return (
    <div className="swiper-container" style={{ position: 'relative', height: '90vh', width: '100%' }}>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
        style={{ height: '100%' }}
      >
        <SwiperSlide>
          <Image src={HomeSlide1} alt="Slide 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={HomeSlide2} alt="Slide 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>

      {/* Teal overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 61, 15, 0.3)', // Teal color with 30% opacity
        zIndex: 1,
      }}></div>

      {/* Constant text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 shadow-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
			Bridging Natural Farmers and Conscious Consumers
            </motion.h1>
            <motion.p
              className="text-xl max-w-2xl mx-auto shadow-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
            Promoting transparency, sustainability, and fair trade in natural farming
            </motion.p>
          </div>
        </div>
    </div>
  );
};

export default MySwiper;