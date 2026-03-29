import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import FaqPageContent from "../components/faqs/FaqPageContent";

export const metadata = {
  title: "Official FAQ | Quantro Network",
  description:
    "Find answers about Quantro Network—membership, expert advisors, billing, technical setup, and support.",
};

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-[#0D0B29] text-slate-900">
      <Navbar />

      <main>
        <div className="bg-[#0D0B29] text-slate-100">
          <FaqPageContent />
        </div>

        <div className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
            <FooterSection />
          </div>
        </div>
      </main>
    </div>
  );
}
