import "./globals.css";
import { Share_Tech_Mono } from "next/font/google";
import { SiteTranslationProvider } from "./components/SiteTranslationProvider";
import TranslationLoadingOverlay from "./components/TranslationLoadingOverlay";
import { ToastProvider } from "./components/ui/ToastProvider";
import connectDB from "../lib/db/mongoose";

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-share-tech-mono",
});

connectDB().catch((error) => {
  console.error("MongoDB startup connection failed:", error);
});

export const metadata = {
  title: "quantro network",
  description: "quantro network",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${shareTechMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        <SiteTranslationProvider>
          <TranslationLoadingOverlay />
          <ToastProvider>{children}</ToastProvider>
        </SiteTranslationProvider>
      </body>
    </html>
  );
}
