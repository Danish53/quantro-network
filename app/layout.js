import "./globals.css";
import { SiteTranslationProvider } from "./components/SiteTranslationProvider";

export const metadata = {
  title: "quantro network",
  description: "quantro network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <SiteTranslationProvider>{children}</SiteTranslationProvider>
      </body>
    </html>
  );
}
