/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

import { Providers } from "@/providers/web3-providers";
import { getServerAuthSession } from "@/server/auth";
import { ContextSessionProvider } from "@/providers/context-session-provider";
import { TonBackendProvider } from "@/providers/ton-backend-provider";
import Navigation from "@/app/_components/navbar/navigation";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TONquest",
  description:
    "TONquest: Your Gateway to Adventure and Rewards! Embark on quests, earn XP, collect exclusive NFTs, and join a vibrant community. Explore the immersive world of TONquest today!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerAuthSession();

  return (
    <html lang="en">
      <body
        className={`min-h-screen font-sans ${inter.variable}  bg-background text-foreground light `}
        suppressHydrationWarning={true}
      >
        <Providers>
          <TRPCReactProvider>
            <ContextSessionProvider serverSession={serverSession}>
              <TonBackendProvider>
                <NextUIProvider>
                  <Toaster position="top-right" richColors />
                  <Navigation />
                  {children}
                </NextUIProvider>
              </TonBackendProvider>
            </ContextSessionProvider>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
