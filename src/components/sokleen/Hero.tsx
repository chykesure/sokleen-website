"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  "Deep Cleaning",
  "Commercial Cleaning",
  "Residential Cleaning",
  "Upholstery Cleaning",
  "Fumigation",
  "Post-Construction",
];

export default function Hero() {
  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0071C5 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-[#0071C5]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00B4D8]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Shimmering Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex justify-center lg:justify-start"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0071C5]/20 to-[#FFD700]/20 blur-xl" />
                
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 rounded-full z-10"
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                      'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Logo with pulse glow */}
                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    filter: [
                      'drop-shadow(0 0 10px rgba(0, 113, 197, 0.3)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.2))',
                      'drop-shadow(0 0 20px rgba(0, 113, 197, 0.5)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.4))',
                      'drop-shadow(0 0 10px rgba(0, 113, 197, 0.3)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.2))',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="SOKLEEN NIGERIA LTD"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Sparkle effects around logo */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
                      top: `${[0, 25, 75, 100, 75, 25][i]}%`,
                      left: `${[50, 100, 100, 50, 0, 0][i]}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0071C5]/10 to-[#FFD700]/10 border border-[#0071C5]/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span className="text-sm font-medium text-[#0071C5]">
                Nigeria&apos;s Leading Cleaning Experts
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Professional Cleaning Services{" "}
              <span className="gradient-text">You Can Trust</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Transform your space with Nigeria&apos;s leading cleaning experts. 
              We bring sparkle to every corner, delivering excellence with every clean.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={scrollToBooking}
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-2 border-[#FFD700] bg-[#FFD700] text-black hover:bg-[#FFD700]/90 hover:text-black px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                <a href="https://wa.me/2348132451474" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 w-5 h-5" />
                  Get Free Quote
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right content - Service cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071C5]/10 to-[#FFD700]/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-[#0071C5]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{service}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
