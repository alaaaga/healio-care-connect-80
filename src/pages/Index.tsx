import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DoctorsSection from "@/components/sections/DoctorsSection";
import ArticlesSection from "@/components/sections/ArticlesSection";
import OffersSection from "@/components/sections/OffersSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DoctorsSection />
      <ArticlesSection />
      <OffersSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
