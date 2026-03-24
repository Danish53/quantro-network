import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import AboutHeroSection from "../components/about/AboutHeroSection";
import AboutMissionVision from "../components/about/AboutMissionVision";
import AboutZenithFeatureSection from "../components/about/AboutZenithFeatureSection";
import AboutPlatformDetailsSection from "../components/about/AboutPlatformDetailsSection";
import AboutCoreValuesSection from "../components/about/AboutCoreValuesSection";
import AboutMobileSection from "../components/about/AboutMobileSection";
import AboutAlgorithmsSection from "../components/about/AboutAlgorithmsSection";
import AboutStatsSection from "../components/about/AboutStatsSection";
import AboutCoreTeamSection from "../components/about/AboutCoreTeamSection";
import AboutSecuritySection from "../components/about/AboutSecuritySection";
import AboutPreFooterCta from "../components/about/AboutPreFooterCta";

export const metadata = {
  title: "About Us | Quantro Network",
  description: "Learn about Quantro Network—mission, platform, mobile access, algorithms, and security.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="bg-[#060a14] text-slate-100">
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-12 sm:gap-16 sm:px-6 sm:py-16 lg:gap-20 lg:px-10 lg:py-20">
          <AboutHeroSection />
          <AboutMissionVision />
          <AboutZenithFeatureSection />
          <AboutPlatformDetailsSection />
          <AboutCoreValuesSection />
          <AboutMobileSection />
          <AboutAlgorithmsSection />
          <AboutStatsSection />
          <AboutCoreTeamSection />
          <AboutSecuritySection />
          <AboutPreFooterCta />
        </main>
      </div>

      <div className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
