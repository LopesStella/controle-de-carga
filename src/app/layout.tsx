import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Controle de Carga",
  description: "Controle de cargas, fretes e recebimentos.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">
        <header className="bg-blue-800 text-white">
          <div className="mx-auto flex max-w-2xl items-center px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              🚛 Controle de Carga
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-5 pb-16">{children}</main>
      </body>
    </html>
  );
}
