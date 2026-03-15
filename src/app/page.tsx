import Hero from "@/components/sokleen/Hero";
import Stats from "@/components/sokleen/Stats";
import Services from "@/components/sokleen/Services";
import TeamSlider from "@/components/sokleen/TeamSlider";
import PriceEstimator from "@/components/sokleen/PriceEstimator";
import Gallery from "@/components/sokleen/Gallery";
import BookingForm from "@/components/sokleen/BookingForm";
import Testimonials from "@/components/sokleen/Testimonials";
import Footer from "@/components/sokleen/Footer";
import WhatsAppButton from "@/components/sokleen/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats/Social Proof */}
      <Stats />

      {/* Services Section */}
      <Services />

      {/* Team Slider - Our Team at Work */}
      <TeamSlider />

      {/* Price Estimator */}
      <PriceEstimator />

      {/* Before & After Gallery */}
      <Gallery />

      {/* Booking Form */}
      <BookingForm />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </main>
  );
}
