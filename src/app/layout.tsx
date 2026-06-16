import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import type { RootLayoutProps } from "@/types";

const suisseIntl = localFont({
  src: [
    {
      path: "../../public/fonts/suisse-intl-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trade Mate",
    template: "%s | Trade Mate",
  },
  description:
    "Trade Mate is a simulated  brokerage and trading terminal built with Next.js and shadcn/ui.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${suisseIntl.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
