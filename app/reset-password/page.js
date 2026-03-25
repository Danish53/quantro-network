import { Suspense } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset password | Quantro Network",
  description: "Set a new password for your Quantro Network account.",
};

function ResetPasswordFallback() {
  return (
    <div className="w-full rounded-[18px] bg-[#161822]/[0.92] px-6 py-10 text-center text-[13px] text-[#9aa3b8] shadow-[0_24px_72px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      Loading…
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout compact>
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
