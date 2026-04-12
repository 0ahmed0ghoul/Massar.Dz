import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import UniversitiesTrustBar from "@/components/landing/Universitiestrustbar";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <UniversitiesTrustBar />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;