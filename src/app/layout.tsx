/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

import { Providers } from "./providers";
import { getServerAuthSession } from "@/server/auth";
import { ContextSessionProviders } from "@/ContextSessionProviders";
import { TonBackendAuthProvider } from "./TonBackendAuth";
import Navigation from "./_components/navigation";
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
            <ContextSessionProviders serverSession={serverSession}>
              <TonBackendAuthProvider>
                <NextUIProvider>
                  <Toaster position="top-right" richColors />
                  <Navigation />
                  {children}
                </NextUIProvider>
              </TonBackendAuthProvider>
            </ContextSessionProviders>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
