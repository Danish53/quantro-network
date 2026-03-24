import Link from "next/link";
import Image from "next/image";
import logoImage from "@/public/images/logo-white.png";

/** Geometric overlapping squares + Quantro NETWORK (white on dark card). */
export default function AuthLogo() {
  return (
    <Link href="/" className="mx-auto mb-3 flex w-fit flex-col items-center gap-3" aria-label="Quantro Network home">
      <Image src={logoImage} alt="logo auth" className="w-40" />
    </Link>
  );
}
