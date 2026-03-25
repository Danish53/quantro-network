import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import TermsPageContent from "../components/terms/TermsPageContent";

export const metadata = {
  title: "Terms & Conditions | Quantro Network",
  description:
    "Read the Terms & Conditions governing your use of Quantro Network services, platform access, and integrations.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <div className="bg-[#050510] text-slate-100">
          <TermsPageContent />
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
