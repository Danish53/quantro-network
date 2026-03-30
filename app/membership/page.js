import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import FaqSection from "../components/FaqSection";
import MembershipPlansSection from "../components/membership/MembershipPlansSection";

export const metadata = {
  title: "Membership Packages | Quantro Network",
  description:
    "Business address plans — Quarterly, semi-annual, and annual membership options with full feature lists and secure checkout.",
};

export default function MembershipPage() {
  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      <main>
        <div className="">
          <MembershipPlansSection />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
          <FaqSection />
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
