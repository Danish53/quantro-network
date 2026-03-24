import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WealthSection from "./components/WealthSection";
// import DashboardPreviewSection from "./components/DashboardPreviewSection";
import HowItWorksSection from "./components/HowItWorksSection";
import SplitFeatureSection from "./components/SplitFeatureSection";
import AtlasSection from "./components/AtlasSection";
import PartnersSection from "./components/PartnersSection";
import FaqSection from "./components/FaqSection";
import BottomCtaSection from "./components/BottomCtaSection";
import FooterSection from "./components/FooterSection";
import Datastreamsfeatures from "./components/Datastreamsfeatures";
import EngineeringTeamSection from "./components/EngineeringTeamSection";
import DocumentationCtaBanner from "./components/DocumentationCtaBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex w-full flex-col gap-14 py-8">
        {/* Hero: keep same side spacing as before (not constrained to max-w-7xl) */}
        <div className="px-4 sm:px-6 lg:px-10">
          <HeroSection />
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:px-10">
          <WealthSection />
          {/* <DashboardPreviewSection /> */}
          <HowItWorksSection />
          <SplitFeatureSection />
          <Datastreamsfeatures />
          <EngineeringTeamSection />
          {/* <AtlasSection /> */}
          <PartnersSection />
          <DocumentationCtaBanner />
          <FaqSection />
          {/* <BottomCtaSection /> */}
        </div>
        <div className="bg-white">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:px-10">
            <FooterSection />
          </div>
        </div>
      </main>
    </div>
  );
}
