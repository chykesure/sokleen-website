"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/2348132451474"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 whatsapp-pulse"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
    </motion.a>
  );
}
