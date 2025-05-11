
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainTitleSection from "@/components/home/MainTitleSection";
import PropertyCarousel from "@/components/home/PropertyCarousel";
import ServicesSection from "@/components/home/ServicesSection";
import DifferenceSection from "@/components/home/DifferenceSection";
import AgenceSection from "@/components/home/AgenceSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream font-raleway">
      {/* Header - Hero Section */}
      <div className="relative">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Main Prestige Title */}
        <MainTitleSection />

        {/* Properties Carousel */}
        <PropertyCarousel />

        {/* Services de l'Agence Section */}
        <ServicesSection />

        {/* Différence & Accompagnement Section */}
        <DifferenceSection />

        {/* Notre Agence Section */}
        <AgenceSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
