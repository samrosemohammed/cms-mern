import { HeroSection } from "../components/HeroSection";
import { Footer } from "../components/Footer";
import { Features } from "../components/Features";
import { NavBar } from "../components/NavBar";

export const Home = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <Features />
      <Footer />
    </>
  );
};
