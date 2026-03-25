import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import PrivacyPolicyContent from "../components/privacy/PrivacyPolicyContent";

export const metadata = {
  title: "Privacy Policy | Quantro Network",
  description:
    "Read how Quantro Network collects, uses, stores, and protects personal information across our platform and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <div className="bg-[#050510] text-slate-100">
          <PrivacyPolicyContent />
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
