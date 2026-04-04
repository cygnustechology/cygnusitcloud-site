import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SolutionsSection from "@/components/SolutionsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ComplianceSection from "@/components/ComplianceSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <SolutionsSection />
    <FeaturesSection />
    <ComplianceSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
