"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Calculator, Home, Bath, Ruler, Sparkles, CheckCircle2, 
  ArrowRight, Shield, Clock, Star, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Pricing based on SOKLEEN NIGERIA official rates
// Residential (Standard): ₦25,000 - ₦35,000 | Deep Cleaning: Higher due to thoroughness
// Commercial (Office): ₦25,000 - ₦45,000 | Post-Construction: Highest intensity
const servicePrices: Record<string, { base: number; perRoom: number; perBathroom: number; perSqm: number }> = {
  // Deep Cleaning - Most thorough, detailed cleaning service
  "deep-cleaning": { base: 30000, perRoom: 4000, perBathroom: 5000, perSqm: 80 },
  
  // Commercial Cleaning - Based on Office Cleaning rates (₦25,000 - ₦45,000)
  "commercial-cleaning": { base: 25000, perRoom: 3500, perBathroom: 4500, perSqm: 100 },
  
  // Residential Cleaning - Based on Home Cleaning Standard (₦25,000 - ₦35,000)
  "residential-cleaning": { base: 18000, perRoom: 2500, perBathroom: 3000, perSqm: 50 },
  
  // Upholstery Cleaning - Specialized furniture cleaning (per item basis)
  "upholstery-cleaning": { base: 10000, perRoom: 2000, perBathroom: 0, perSqm: 50 },
  
  // Fumigation - Pest control service (area-based pricing)
  "fumigation": { base: 15000, perRoom: 1500, perBathroom: 2000, perSqm: 80 },
  
  // Post-Construction - Most intensive, heavy-duty cleaning (highest price)
  "post-construction": { base: 40000, perRoom: 6000, perBathroom: 8000, perSqm: 150 },
};

const services = [
  { value: "deep-cleaning", label: "Deep Cleaning", icon: Sparkles },
  { value: "commercial-cleaning", label: "Commercial Cleaning", icon: Home },
  { value: "residential-cleaning", label: "Residential Cleaning", icon: Home },
  { value: "upholstery-cleaning", label: "Upholstery Cleaning", icon: Sparkles },
  { value: "fumigation", label: "Fumigation", icon: Shield },
  { value: "post-construction", label: "Post-Construction", icon: Home },
];

const features = [
  { icon: CheckCircle2, text: "No hidden charges", color: "text-green-600" },
  { icon: CheckCircle2, text: "Free cancellation", color: "text-green-600" },
  { icon: CheckCircle2, text: "Insured professionals", color: "text-green-600" },
];

export default function PriceEstimator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [squareMeters, setSquareMeters] = useState(100);
  const [serviceType, setServiceType] = useState("residential-cleaning");

  const calculatePrice = () => {
    const pricing = servicePrices[serviceType] || servicePrices["residential-cleaning"];
    const total = pricing.base + 
      (rooms * pricing.perRoom) + 
      (bathrooms * pricing.perBathroom) + 
      (squareMeters * pricing.perSqm);
    return total;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} className="py-24 section-pricing relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sokleen-light-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sokleen-yellow/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-sokleen-yellow/20 border border-sokleen-yellow/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-sokleen-dark-blue" />
            <span className="text-sm font-semibold text-sokleen-dark-blue">
              Instant Price Calculator
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get Your <span className="text-sokleen-dark-blue">Free Quote</span> in Seconds
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Select your service, adjust the details, 
            and see your estimated cost instantly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-sokleen-light-blue/10 to-sokleen-yellow/10 rounded-2xl p-6 border border-sokleen-light-blue/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-sokleen-yellow fill-sokleen-yellow" />
                  ))}
                </div>
                <span className="text-gray-900 font-bold">5.0</span>
                <span className="text-gray-500 text-sm">(500+ reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-sokleen-dark-blue" />
                <span className="text-sm">Available 24/7 for your convenience</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Calculator Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
              {/* Service Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Service Type
                </label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-12 rounded-xl hover:bg-gray-100 transition-colors">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 rounded-xl">
                    {services.map((service) => (
                      <SelectItem 
                        key={service.value} 
                        value={service.value}
                        className="rounded-lg hover:bg-sokleen-light-blue/10 focus:bg-sokleen-light-blue/10"
                      >
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-5 mb-6">
                {/* Rooms Slider */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-sokleen-dark-blue/10 flex items-center justify-center">
                        <Home className="w-4 h-4 text-sokleen-dark-blue" />
                      </div>
                      Number of Rooms
                    </label>
                    <span className="text-xl font-bold text-sokleen-dark-blue bg-white px-3 py-1 rounded-lg border border-sokleen-light-blue/30">
                      {rooms}
                    </span>
                  </div>
                  <Slider
                    value={[rooms]}
                    onValueChange={(value) => setRooms(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Bathrooms Slider */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-sokleen-yellow/20 flex items-center justify-center">
                        <Bath className="w-4 h-4 text-sokleen-dark-blue" />
                      </div>
                      Number of Bathrooms
                    </label>
                    <span className="text-xl font-bold text-sokleen-dark-blue bg-white px-3 py-1 rounded-lg border border-sokleen-light-blue/30">
                      {bathrooms}
                    </span>
                  </div>
                  <Slider
                    value={[bathrooms]}
                    onValueChange={(value) => setBathrooms(value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Square Meters Slider */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-sokleen-dark-blue/10 flex items-center justify-center">
                        <Ruler className="w-4 h-4 text-sokleen-dark-blue" />
                      </div>
                      Square Meters
                    </label>
                    <span className="text-xl font-bold text-sokleen-dark-blue bg-white px-3 py-1 rounded-lg border border-sokleen-light-blue/30">
                      {squareMeters} m²
                    </span>
                  </div>
                  <Slider
                    value={[squareMeters]}
                    onValueChange={(value) => setSquareMeters(value[0])}
                    min={50}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>50 m²</span>
                    <span>500 m²</span>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative mb-6"
              >
                <div className="bg-gradient-to-r from-sokleen-yellow via-sokleen-yellow to-sokleen-yellow/90 rounded-2xl p-6 border border-sokleen-yellow/30 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-700 font-medium mb-1">Estimated Price</p>
                      <motion.p 
                        key={calculatePrice()}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900"
                      >
                        {formatPrice(calculatePrice())}
                      </motion.p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/50 px-3 py-1.5 rounded-lg">
                      <Sparkles className="w-4 h-4 text-sokleen-dark-blue" />
                      <span>Best price guarantee</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Final price confirmed after free on-site assessment
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={scrollToBooking}
                  className="flex-1 bg-sokleen-yellow hover:bg-sokleen-yellow/90 text-black font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Book Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 border-sokleen-dark-blue text-sokleen-dark-blue hover:bg-sokleen-light-blue/10 py-6 text-lg rounded-xl transition-all duration-300"
                >
                  <a href="https://wa.me/2348132451474" target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
