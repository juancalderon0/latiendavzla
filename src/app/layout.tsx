import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
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
  title: `${STORE.name} — Belleza, tecnología y más`,
  description:
    "Belleza, tecnología, cuidado personal, salud y curiosidades en Venezuela.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        <CartProvider>
          <Header />
          <main className="flex flex-1 flex-col pb-20 sm:pb-0">{children}</main>
          <footer className="border-t border-black/10 py-8 text-center text-xs text-black/50">
            <a
              href={STORE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block font-medium text-black/70 hover:text-black"
            >
              Síguenos en Instagram
            </a>
            © {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.
          </footer>
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
