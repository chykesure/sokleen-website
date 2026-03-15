"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Camera, ChevronLeft, ChevronRight, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  service: string | null;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string | null;
  afterAlt: string | null;
  order: number;
  isActive: boolean;
}

// Fallback placeholder items when no images are in database
const fallbackItems = [
  {
    id: "fallback-1",
    title: "Living Room Transformation",
    description: "Complete deep cleaning of a family living room",
    beforeText: "Dusty carpets, stained upholstery, and cluttered surfaces",
    afterText: "Pristine carpets, refreshed furniture, and spotless surfaces",
  },
  {
    id: "fallback-2",
    title: "Kitchen Deep Clean",
    description: "Professional kitchen cleaning service",
    beforeText: "Greasy surfaces, dirty appliances, and stained floors",
    afterText: "Sparkling surfaces, sanitized appliances, and gleaming floors",
  },
  {
    id: "fallback-3",
    title: "Office Space Revival",
    description: "Commercial cleaning for a corporate office",
    beforeText: "Dusty workstations, stained carpets, and grimy windows",
    afterText: "Clean workstations, fresh carpets, and crystal-clear windows",
  },
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRealImages, setHasRealImages] = useState(false);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery");
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setImages(result.data);
        setHasRealImages(true);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle slider movement
  const updateSliderPosition = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(5, Math.min(95, percentage)));
    }
  }, []);

  // Mouse events
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateSliderPosition(e.clientX);
    }
  };

  // Touch events
  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = hasRealImages ? images.length - 1 : fallbackItems.length - 1;
      return (prev + 1) % (maxIndex + 1);
    });
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = hasRealImages ? images.length - 1 : fallbackItems.length - 1;
      return (prev - 1 + maxIndex + 1) % (maxIndex + 1);
    });
    setSliderPosition(50);
  };

  const totalItems = hasRealImages ? images.length : fallbackItems.length;

  // Reset dragging state when mouse leaves window
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  return (
    <section className="py-24 section-gallery relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-sokleen-light-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sokleen-yellow/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-sokleen-yellow/20 border border-sokleen-yellow/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-sokleen-dark-blue" />
            <span className="text-sm font-semibold text-sokleen-dark-blue">
              Our Work
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Before & After <span className="text-sokleen-dark-blue">Gallery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the transformation for yourself. Drag the slider to reveal the difference 
            our professional cleaning makes.
          </p>
        </motion.div>

        {/* Gallery Item */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="aspect-video rounded-3xl bg-gray-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : hasRealImages && images[currentIndex] ? (
            // Real Images from Database
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {images[currentIndex].title}
                </h3>
                {images[currentIndex].description && (
                  <p className="text-gray-600">{images[currentIndex].description}</p>
                )}
              </div>

              <div
                ref={containerRef}
                className="relative aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none bg-gray-200 shadow-2xl border border-gray-100"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
              >
                {/* After Image (Base layer) */}
                <div className="absolute inset-0">
                  <img
                    src={images[currentIndex].afterImage}
                    alt={images[currentIndex].afterAlt || "After cleaning"}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* After Label */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                      <Camera className="w-4 h-4" />
                      <span className="font-semibold text-sm">AFTER</span>
                    </div>
                  </div>
                  {/* Watermark */}
                  <div className="absolute bottom-4 right-4 text-xs text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                    SOKLEEN NIGERIA LTD
                  </div>
                </div>

                {/* Before Image (Clip layer) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={images[currentIndex].beforeImage}
                    alt={images[currentIndex].beforeAlt || "Before cleaning"}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Before Label */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                      <Camera className="w-4 h-4" />
                      <span className="font-semibold text-sm">BEFORE</span>
                    </div>
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-30"
                  style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-sokleen-dark-blue">
                    <div className="flex items-center gap-0.5">
                      <ChevronLeft className="w-3 h-3 text-gray-400" />
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Fallback Placeholder
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {fallbackItems[currentIndex]?.title}
                </h3>
                <p className="text-gray-600">{fallbackItems[currentIndex]?.description}</p>
              </div>

              <div
                ref={containerRef}
                className="relative aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl border border-gray-100"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
              >
                {/* After Side (Base layer) */}
                <div className="absolute inset-0 bg-gradient-to-br from-sokleen-light-blue/40 via-sokleen-light-blue/30 to-sokleen-yellow/40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 max-w-lg">
                      <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                        <Camera className="w-4 h-4" />
                        <span className="font-semibold text-sm">AFTER</span>
                      </div>
                      <p className="text-gray-800 font-medium text-lg">
                        {fallbackItems[currentIndex]?.afterText}
                      </p>
                    </div>
                  </div>
                  {/* Watermark */}
                  <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                    SOKLEEN NIGERIA LTD
                  </div>
                </div>

                {/* Before Side (Clip layer) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-350 to-gray-500 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 max-w-lg">
                      <div className="inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                        <Camera className="w-4 h-4" />
                        <span className="font-semibold text-sm">BEFORE</span>
                      </div>
                      <p className="text-gray-800 font-medium text-lg">
                        {fallbackItems[currentIndex]?.beforeText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-30"
                  style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-sokleen-dark-blue">
                    <div className="flex items-center gap-0.5">
                      <ChevronLeft className="w-3 h-3 text-gray-400" />
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full w-12 h-12 border-gray-200 hover:bg-sokleen-dark-blue hover:text-white hover:border-sokleen-dark-blue transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {[...Array(totalItems)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSliderPosition(50);
                  }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-sokleen-dark-blue w-8"
                      : "bg-gray-300 hover:bg-gray-400 w-3"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full w-12 h-12 border-gray-200 hover:bg-sokleen-dark-blue hover:text-white hover:border-sokleen-dark-blue transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* No Images Message */}
          {!isLoading && !hasRealImages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-10 p-6 bg-sokleen-light-blue/10 rounded-2xl border border-sokleen-light-blue/20"
            >
              <div className="w-14 h-14 bg-sokleen-light-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-7 h-7 text-sokleen-dark-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Gallery Coming Soon</h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                We&apos;re preparing amazing before & after transformations to showcase our work. Check back soon!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
