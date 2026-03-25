import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export const metadata = {
  title: "Register | Quantro Network",
  description: "Create your Quantro Network membership account.",
};

export default function RegisterPage() {
  return (
    <AuthLayout compact>
      <RegisterForm />
    </AuthLayout>
  );
}
