import type { Metadata } from "next";
import { Instrument_Sans, Roboto_Flex } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import ChatbaseBot from "@/components/chatBaseBot";


const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrushiMart",
  description: "Bridging the gap between natural farmers and concious customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...{ webcrx: "false" }}>
      <head>
      </head>
      <body
        className={`${instrumentSans.variable} ${robotoFlex.variable} bg-[#FAFAFA] antialiased`}
      >
        <NextTopLoader height={3} color="#1565C0" showSpinner={false} />
        <Toaster/>
        {children}
        <ChatbaseBot/>
      </body>
    </html>
  );
}
