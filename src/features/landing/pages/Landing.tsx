import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "../Hero";
import Features from "../Features";
import UniversitiesCompaniesTrustBar from "../Universitiestrustbar";
import HowItWorks from "../HowItWorks";
import CTA from "../CTA";


const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <UniversitiesCompaniesTrustBar />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;