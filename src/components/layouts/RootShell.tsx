import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Alexander Pulido | Senior Full-Stack Developer & Musician",
  description: "Portfolio of Alexander Pulido, a Senior Full-Stack Developer specializing in Elixir, Phoenix, Vue.js, and Kubernetes. Based in Colombia, working globally on enterprise applications, game development, and music production.",
  keywords: ["Alexander Pulido", "Full-Stack Developer", "Elixir", "Phoenix", "Vue.js", "Kubernetes", "Software Engineer", "Colombia", "Portfolio"],
  authors: [{ name: "Alexander Pulido", url: "https://alexanderpulido.com" }],
  creator: "Alexander Pulido",
  publisher: "Alexander Pulido",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Alexander Pulido | Senior Full-Stack Developer & Musician",
    description: "Portfolio of Alexander Pulido, a Senior Full-Stack Developer specializing in Elixir, Phoenix, Vue.js, and Kubernetes.",
    siteName: "Alexander Pulido Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexander Pulido | Senior Full-Stack Developer & Musician",
    description: "Portfolio of Alexander Pulido, a Senior Full-Stack Developer specializing in Elixir, Phoenix, Vue.js, and Kubernetes.",
  },
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
