"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Building, Home, Sofa, Bug, HardHat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "deep-cleaning",
    icon: Sparkles,
    title: "Deep Cleaning",
    description: "Comprehensive cleaning that reaches every hidden corner of your space.",
    valueProposition: "We clean where you don't look",
    features: ["Hidden areas focus", "Detailed sanitization", "Complete transformation"],
    color: "bg-sokleen-light-blue/10",
    iconColor: "text-sokleen-dark-blue",
  },
  {
    id: "commercial-cleaning",
    icon: Building,
    title: "Commercial Cleaning",
    description: "Professional cleaning services for offices, retail spaces, and commercial properties.",
    valueProposition: "Your business doesn't stop, neither do we",
    features: ["Night-shift availability", "Flexible scheduling", "Minimal disruption"],
    color: "bg-sokleen-yellow/10",
    iconColor: "text-sokleen-dark-blue",
  },
  {
    id: "residential-cleaning",
    icon: Home,
    title: "Residential Cleaning",
    description: "Transform your home into a pristine living space with our expert residential cleaning.",
    valueProposition: "Reclaim your weekend",
    features: ["Time & peace focus", "Customizable packages", "Eco-friendly products"],
    color: "bg-sokleen-light-blue/10",
    iconColor: "text-sokleen-dark-blue",
  },
  {
    id: "upholstery-cleaning",
    icon: Sofa,
    title: "Upholstery Cleaning",
    description: "Deep cleaning for your furniture, removing stains, allergens, and embedded dirt.",
    valueProposition: "Removing what the vacuum leaves behind",
    features: ["Health & allergens", "Fabric protection", "Extended furniture life"],
    color: "bg-sokleen-yellow/10",
    iconColor: "text-sokleen-dark-blue",
  },
  {
    id: "fumigation",
    icon: Bug,
    title: "Fumigation",
    description: "Complete pest control and fumigation services for a safe and healthy environment.",
    valueProposition: "Total eradication, zero compromise on safety",
    features: ["Safety & compliance", "Long-lasting protection", "Family-safe solutions"],
    color: "bg-sokleen-light-blue/10",
    iconColor: "text-sokleen-dark-blue",
  },
  {
    id: "post-construction",
    icon: HardHat,
    title: "Post-Construction",
    description: "Thorough cleanup after construction or renovation projects, making spaces livable.",
    valueProposition: "Turning a site into a home",
    features: ["The final polish", "Dust removal", "Debris clearance"],
    color: "bg-sokleen-yellow/10",
    iconColor: "text-sokleen-dark-blue",
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-20 section-services relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-pattern-grid" />
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sokleen-dark-blue font-semibold text-sm uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Professional Cleaning Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive cleaning services tailored to meet your specific needs. 
            Every service is delivered with excellence and attention to detail.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 card-hover border border-gray-100"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-7 h-7 ${service.iconColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>

              {/* Value Proposition */}
              <p className="text-sokleen-dark-blue font-medium text-sm mb-4 italic">
                &quot;{service.valueProposition}&quot;
              </p>

              {/* Description */}
              <p className="text-gray-600 mb-6">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-sokleen-light-blue" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant="ghost"
                onClick={scrollToBooking}
                className="text-sokleen-dark-blue hover:text-sokleen-dark-blue hover:bg-sokleen-light-blue/10 font-semibold p-0 h-auto group/btn"
              >
                Book This Service
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
