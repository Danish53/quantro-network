import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import RoadmapHeroSection from "../components/roadmap/RoadmapHeroSection";
import RoadmapVisionSection from "../components/roadmap/RoadmapVisionSection";
import RoadmapTimelineSection from "../components/roadmap/RoadmapTimelineSection";
import RoadmapCtaBanner from "../components/roadmap/RoadmapCtaBanner";

export const metadata = {
  title: "Product Roadmap | Quantro Network",
  description:
    "Official Quantro Network product roadmap—from infrastructure and launch to global growth, enterprise, and community governance.",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="bg-[#060a14] text-slate-100">
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:gap-14 sm:px-6 sm:py-16 lg:gap-16 lg:px-10 lg:py-20">
          <RoadmapHeroSection />
          <RoadmapVisionSection />
          <RoadmapTimelineSection />
          <RoadmapCtaBanner />
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
