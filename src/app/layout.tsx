/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

import { Providers } from "@/providers/web3-providers";
import { getServerAuthSession } from "@/server/auth";
import { ContextSessionProvider } from "@/providers/context-session-provider";
import { TonBackendProvider } from "@/providers/ton-backend-provider";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import { NavbarMain } from "@/app/_components/navbar/NavbarMain";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ConnectKitWeb3Provider } from "@/providers/connect-kit-provider";

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
  twitter: {
    card: "summary",
    title: "TONquest",
    description:
      "TONquest: Your Gateway to Adventure and Rewards! Embark on quests, earn XP, collect exclusive NFTs, and join a vibrant community. Explore the immersive world of TONquest today!",
    creator: "@aveandrian",
    images: ["https://tonquest.vercel.app/seo_image.png"], // Must be an absolute URL
  },
  openGraph: {
    title: "TONquest",
    description:
      "TONquest: Your Gateway to Adventure and Rewards! Embark on quests, earn XP, collect exclusive NFTs, and join a vibrant community. Explore the immersive world of TONquest today!",
    url: "https://tonquest.vercel.app",
    siteName: "TONquest",
    images: [
      {
        url: "https://tonquest.vercel.app/seo_image.png", // Must be an absolute URL
        width: 1492,
        height: 932,
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
        className={`min-h-lvh font-sans ${inter.variable}  bg-background text-foreground light `}
        suppressHydrationWarning={true}
      >
        <Providers>
          <TRPCReactProvider>
            <ContextSessionProvider serverSession={serverSession}>
              <TonBackendProvider>
                <ConnectKitWeb3Provider>
                  <NextUIProvider>
                    <Toaster position="top-right" richColors />
                    <NavbarMain />
                    {children}
                    <GoogleAnalytics gaId="G-25RJWZW92Q" />
                  </NextUIProvider>
                </ConnectKitWeb3Provider>
              </TonBackendProvider>
            </ContextSessionProvider>
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
