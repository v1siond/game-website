import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue } from "next/font/google";
import "../../styles/globals.css";
import ClientProviders from "../providers/ClientProviders";
import { SITE_ORIGIN } from "@/lib/seo";
import { MARK_BACKGROUND } from "@/lib/siteMark";
import { getLabels } from "@/lib/cv-data";
import type { Locale } from "@/i18n/config";

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

// Every page's relative metadata URLs (the root opengraph-image file, canonicals) resolve against the
// site's address, the 404 page's included, which sets no page metadata of its own.
export const metadata: Metadata = {
  metadataBase: SITE_ORIGIN,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: MARK_BACKGROUND,
};

interface RootShellProps {
  lang: Locale;
  children: React.ReactNode;
}

/**
 * The document every root layout renders: fonts, head and the world providers, with the worlds text in the
 * document's language. The site and the CV are separate root layouts (route groups) only so each can set its
 * own `lang`; everything else is this.
 */
export default async function RootShell({ lang, children }: Readonly<RootShellProps>) {
  const labels = await getLabels(lang);
  // The home page's inline script may set data-world-pending on <html> before hydration
  // (src/themes/worldPending.ts); suppressHydrationWarning covers that one attribute level only.
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${silkScreen.className} ${silkScreen.variable} ${permanentMarker.className} ${bebasNeue.variable} antialiased`}
      >
        <ClientProviders worldsLabels={labels.worlds}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
