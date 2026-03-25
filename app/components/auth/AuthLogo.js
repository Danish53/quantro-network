import Link from "next/link";
import Image from "next/image";
import logoImage from "@/public/images/logo-white.png";

/** Geometric overlapping squares + Quantro NETWORK (white on dark card). */
export default function AuthLogo({ compact = false }) {
  return (
    <Link
      href="/"
      className={`mx-auto flex w-fit flex-col items-center ${compact ? "mb-2 gap-2" : "mb-3 gap-3"}`}
      aria-label="Quantro Network home"
    >
      <Image src={logoImage} alt="" className={compact ? "w-36" : "w-40"} />
    </Link>
  );
}
