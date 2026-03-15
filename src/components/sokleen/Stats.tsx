"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Briefcase, Star, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Customers",
    color: "text-sokleen-dark-blue",
    bgColor: "bg-sokleen-light-blue/10",
  },
  {
    icon: Briefcase,
    value: 6,
    suffix: "",
    label: "Professional Services",
    color: "text-sokleen-dark-blue",
    bgColor: "bg-sokleen-yellow/10",
  },
  {
    icon: Star,
    value: 5,
    suffix: "-Star",
    label: "Reviews",
    color: "text-sokleen-dark-blue",
    bgColor: "bg-sokleen-light-blue/10",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Availability",
    color: "text-sokleen-dark-blue",
    bgColor: "bg-sokleen-yellow/10",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-16 section-golden relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-pattern-dots" />

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${stat.bgColor} mb-4`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
