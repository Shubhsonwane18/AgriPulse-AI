import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { LocationProvider } from "@/components/LocationContext";
import { LocationModal } from "@/components/LocationModal";
import { AuthProvider } from "@/components/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#165b33",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AgriPulse (किसानमित्र) | AI Mandi Prices, Precision Soil Engine & Decision Support",
  description: "Free digital platform for Indian farmers: Live APMC Mandi prices, 14-day ML price forecasting, ICAR-approved fertilizer regimens, and multilingual voice AI assistant on WhatsApp and Web.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                // If running on localhost / dev, clear service workers & stale caches
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var i = 0; i < regs.length; i++) {
                      regs[i].unregister();
                    }
                  });
                  if ('caches' in window) {
                    caches.keys().then(function(keys) {
                      for (var j = 0; j < keys.length; j++) {
                        caches.delete(keys[j]);
                      }
                    });
                  }
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {});
                  });
                }
              }
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f4f6f4] text-gray-900 font-sans selection:bg-emerald-600 selection:text-white">
        <LanguageProvider>
          <LocationProvider>
            <AuthProvider>
              <Navbar />
              <LocationModal />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

