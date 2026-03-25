import { Suspense } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import VerifyOtpForm from "../components/auth/VerifyOtpForm";

export const metadata = {
  title: "Verification code | Quantro Network",
  description: "Enter the one-time code sent to your email.",
};

function VerifyOtpFallback() {
  return (
    <div className="w-full rounded-[18px] bg-[#161822]/[0.92] px-6 py-10 text-center text-[13px] text-[#9aa3b8] shadow-[0_24px_72px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      Loading…
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <AuthLayout compact>
      <Suspense fallback={<VerifyOtpFallback />}>
        <VerifyOtpForm />
      </Suspense>
    </AuthLayout>
  );
}
