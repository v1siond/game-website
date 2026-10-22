import type { Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue } from "next/font/google";
import "../../styles/globals.css";
import ClientProviders from "../providers/ClientProviders";

const silkScreen = localFont({
  src: [
    {
      path: "../../assets/fonts/Silkscreen-Regular.ttf",
      weight: '400',
      style: 'normal'
    },
    {
      path: "../../assets/fonts/Silkscreen-Bold.ttf",
      weight: '700',
      style: 'normal'
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-silkscreen',
});

const permanentMarker = localFont({
  src: [
    {
      path: "../../assets/fonts/PermanentMarker-Regular.ttf",
      weight: '400',
      style: 'normal'
    }
  ],
  display: 'swap',
  preload: true,
});

// Bold Noir's display face. Only that world sets it (through --font-bebas-neue), so it is not preloaded
// on every page.
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-bebas-neue',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
};

interface RootShellProps {
  lang: string;
  children: React.ReactNode;
}

/**
 * The document every root layout renders: fonts, head and the world providers. The site and the CV are
 * separate root layouts (route groups) only so each can set its own `lang`; everything else is this.
 */
export default function RootShell({ lang, children }: Readonly<RootShellProps>) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${silkScreen.className} ${silkScreen.variable} ${permanentMarker.className} ${bebasNeue.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
