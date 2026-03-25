import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Recover Password | Quantro Network",
  description: "Reset your Quantro Network account password via email.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout compact>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
