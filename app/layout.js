import "./globals.css";
import { SiteTranslationProvider } from "./components/SiteTranslationProvider";
import { ToastProvider } from "./components/ui/ToastProvider";
import connectDB from "../lib/db/mongoose";

connectDB().catch((error) => {
  console.error("MongoDB startup connection failed:", error);
});

export const metadata = {
  title: "quantro network",
  description: "quantro network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full overflow-x-hidden antialiased">
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        <SiteTranslationProvider>
          <ToastProvider>{children}</ToastProvider>
        </SiteTranslationProvider>
      </body>
    </html>
  );
}
