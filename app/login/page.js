import { Suspense } from "react";
import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export const metadata = {
  title: "Login | Quantro Network",
  description: "Sign in to your Quantro Network account.",
};

function LoginFallback() {
  return (
    <div className="w-full rounded-[18px] bg-[#161822]/[0.92] px-6 py-10 text-center text-[13px] text-[#9aa3b8] shadow-[0_24px_72px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      Loading…
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout compact>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
