"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Mr Ay",
    role: "Homeowner, Lagos",
    content:
      "SOKLEEN transformed my home completely! Their deep cleaning service was exceptional. Every corner of my house sparkles now. I highly recommend them for anyone looking for professional cleaning services.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mr Michael",
    role: "Business Owner, Abuja",
    content:
      "We've been using SOKLEEN for our office cleaning for over a year now. Their commercial cleaning team is professional, reliable, and thorough. Our workspace has never looked better!",
    rating: 5,
  },
  {
    id: 3,
    name: "Mr Abraham",
    role: "Property Manager, Ilesa",
    content:
      "Post-construction cleaning was a breeze with SOKLEEN. They turned our newly built property into a move-in ready home in just one day. Incredible attention to detail!",
    rating: 5,
  },
  {
    id: 4,
    name: "Deelaw",
    role: "Restaurant Owner, Osun",
    content:
      "Outstanding service! SOKLEEN has been cleaning our restaurant weekly and the hygiene standards have improved tremendously. Very professional team and great attention to detail.",
    rating: 5,
  },
  {
    id: 5,
    name: "Mr Bobby",
    role: "Hotel Manager, Ibadan",
    content:
      "Our hotel rooms have never been cleaner. SOKLEEN's team is punctual, thorough, and always leaves our guests impressed with the cleanliness. Highly recommended for hospitality businesses!",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Calculate position for each slide in coverflow
  const getSlideStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalSlides = testimonials.length;
    
    let adjustedDiff = diff;
    if (Math.abs(diff) > Math.floor(totalSlides / 2)) {
      adjustedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }

    const isActive = adjustedDiff === 0;
    const isPrev = adjustedDiff === -1;
    const isNext = adjustedDiff === 1;
    const isFarLeft = adjustedDiff < -1;
    const isFarRight = adjustedDiff > 1;

    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 0;

    if (isActive) {
      translateX = 0;
      translateZ = 100;
      rotateY = 0;
      scale = 1;
      opacity = 1;
      zIndex = 30;
    } else if (isPrev) {
      translateX = -60;
      translateZ = -50;
      rotateY = 35;
      scale = 0.75;
      opacity = 0.7;
      zIndex = 20;
    } else if (isNext) {
      translateX = 60;
      translateZ = -50;
      rotateY = -35;
      scale = 0.75;
      opacity = 0.7;
      zIndex = 20;
    } else if (isFarLeft) {
      translateX = -110;
      translateZ = -150;
      rotateY = 45;
      scale = 0.5;
      opacity = 0.3;
      zIndex = 10;
    } else if (isFarRight) {
      translateX = 110;
      translateZ = -150;
      rotateY = -45;
      scale = 0.5;
      opacity = 0.3;
      zIndex = 10;
    }

    return { translateX, translateZ, rotateY, scale, opacity, zIndex };
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#0071C5] via-[#0088CC] to-[#00B4D8]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
          >
            <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-sm font-semibold text-white">Testimonials</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {/* Coverflow Slider Container */}
        <div 
          className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* 3D Perspective Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative w-full h-full"
              style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
            >
              <div 
                className="relative w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {testimonials.map((testimonial, index) => {
                  const style = getSlideStyle(index);
                  const isActive = index === currentIndex;
                  
                  return (
                    <motion.div
                      key={testimonial.id}
                      className="absolute cursor-pointer"
                      style={{
                        width: '85%',
                        maxWidth: '500px',
                        height: '320px',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-42.5%',
                        marginTop: '-160px',
                        zIndex: style.zIndex,
                      }}
                      animate={{
                        x: `${style.translateX}%`,
                        z: style.translateZ,
                        rotateY: style.rotateY,
                        scale: style.scale,
                        opacity: style.opacity,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 1,
                      }}
                      onClick={() => goToSlide(index)}
                    >
                      {/* Card Container */}
                      <div 
                        className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-300 ${
                          isActive ? 'shadow-[0_25px_60px_-15px_rgba(255,215,0,0.4)]' : ''
                        }`}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Card Background */}
                        <div className="absolute inset-0 bg-white" />
                        
                        {/* Content */}
                        <div className="relative w-full h-full p-6 sm:p-8 flex flex-col">
                          {/* Quote Icon */}
                          <div className="absolute -top-3 left-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0071C5] to-[#00B4D8] rounded-full flex items-center justify-center shadow-lg">
                              <Quote className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex gap-1 mb-4 mt-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-[#FFD700] text-[#FFD700]"
                              />
                            ))}
                          </div>

                          {/* Content */}
                          <p className="text-gray-600 leading-relaxed flex-1 text-sm sm:text-base">
                            &ldquo;{testimonial.content}&rdquo;
                          </p>

                          {/* Author */}
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0071C5] to-[#00B4D8] flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{testimonial.name}</p>
                              <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/95 hover:bg-white text-[#0071C5] shadow-xl transition-all duration-300 z-40 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/95 hover:bg-white text-[#0071C5] shadow-xl transition-all duration-300 z-40 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToSlide(index)}
              className="group"
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 sm:w-10 bg-[#FFD700]"
                    : "w-2 sm:w-3 bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
