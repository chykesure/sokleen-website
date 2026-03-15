"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const teamSlides = [
  {
    id: 1,
    image: "/team/team-1.jpg",
    quote: "Excellence in Every Clean",
  },
  {
    id: 2,
    image: "/team/team-2.jpg",
    quote: "Your Satisfaction, Our Priority",
  },
  {
    id: 3,
    image: "/team/team-3.jpg",
    quote: "Transforming Spaces, One Clean at a Time",
  },
  {
    id: 4,
    image: "/team/team-4.jpg",
    quote: "Professional Service You Can Trust",
  },
  {
    id: 5,
    image: "/team/team-5.jpg",
    quote: "Dedicated to Making Your Space Sparkle",
  },
];

export default function TeamSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + teamSlides.length) % teamSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % teamSlides.length);
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
    const totalSlides = teamSlides.length;
    
    // Handle wrap-around
    let adjustedDiff = diff;
    if (Math.abs(diff) > Math.floor(totalSlides / 2)) {
      adjustedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }

    const isActive = adjustedDiff === 0;
    const isPrev = adjustedDiff === -1;
    const isNext = adjustedDiff === 1;
    const isFarLeft = adjustedDiff < -1;
    const isFarRight = adjustedDiff > 1;

    // Base values
    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 0;

    if (isActive) {
      // Center/Active slide
      translateX = 0;
      translateZ = 100;
      rotateY = 0;
      scale = 1;
      opacity = 1;
      zIndex = 30;
    } else if (isPrev) {
      // Previous slide (left)
      translateX = -55;
      translateZ = -50;
      rotateY = 35;
      scale = 0.75;
      opacity = 0.7;
      zIndex = 20;
    } else if (isNext) {
      // Next slide (right)
      translateX = 55;
      translateZ = -50;
      rotateY = -35;
      scale = 0.75;
      opacity = 0.7;
      zIndex = 20;
    } else if (isFarLeft) {
      // Far left slides
      translateX = -100;
      translateZ = -150;
      rotateY = 45;
      scale = 0.5;
      opacity = 0.3;
      zIndex = 10;
    } else if (isFarRight) {
      // Far right slides
      translateX = 100;
      translateZ = -150;
      rotateY = -45;
      scale = 0.5;
      opacity = 0.3;
      zIndex = 10;
    }

    return {
      translateX,
      translateZ,
      rotateY,
      scale,
      opacity,
      zIndex,
    };
  };

  const currentSlide = teamSlides[currentIndex];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a365d]">
      {/* Header Section */}
      <div className="relative z-10 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-semibold text-white">Our Team at Work</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            Dedicated Professionals Serving You
          </motion.h2>
        </div>
      </div>

      {/* Coverflow Slider Container */}
      <div 
        className="relative w-full h-[450px] sm:h-[500px] lg:h-[550px]"
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
            {/* Slides Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {teamSlides.map((slide, index) => {
                const style = getSlideStyle(index);
                const isActive = index === currentIndex;
                
                return (
                  <motion.div
                    key={slide.id}
                    className="absolute cursor-pointer"
                    style={{
                      width: '85%',
                      maxWidth: '700px',
                      height: '350px',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-42.5%',
                      marginTop: '-175px',
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
                        isActive ? 'shadow-[0_25px_60px_-15px_rgba(0,113,197,0.5)]' : ''
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Image */}
                      <Image
                        src={slide.image}
                        alt="Sokleen Team at Work"
                        fill
                        className="object-cover object-center"
                        priority
                        sizes="(max-width: 768px) 85vw, 700px"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Quote - Only visible on active slide */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6"
                        >
                          <div className="bg-gradient-to-r from-[#0071C5] to-[#00B4D8] px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-xl">
                            <p className="text-base sm:text-lg lg:text-xl font-bold text-white text-center">
                              &ldquo;{slide.quote}&rdquo;
                            </p>
                          </div>
                        </motion.div>
                      )}
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
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/95 hover:bg-white text-[#0071C5] shadow-xl transition-all duration-300 z-40 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        {/* Brand Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-[#0071C5] font-bold text-xs sm:text-sm">SOKLEEN NIGERIA LTD</span>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="relative z-10 pb-8 sm:pb-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {teamSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className="group"
              aria-label={`Go to slide ${index + 1}`}
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
