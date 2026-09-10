import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SocialLinks } from "@/components/SocialLinks";
import { StorefrontOnly } from "@/components/StorefrontOnly";
import { STORE } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${STORE.name} — Belleza, salud y ropa`,
  description:
    "Belleza, salud y cuidado personal, y ropa mujer, con envíos en Venezuela.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <CartProvider>
          <StorefrontOnly>
            <Header />
          </StorefrontOnly>
          <main className="flex flex-1 flex-col pb-20 sm:pb-0">{children}</main>
          <StorefrontOnly>
            <footer className="border-t border-black/10 py-8 text-center text-xs text-black/50">
              <div className="mb-4">
                <SocialLinks />
              </div>
              © {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.
            </footer>
            <WhatsAppButton />
          </StorefrontOnly>
        </CartProvider>
      </body>
    </html>
  );
}
