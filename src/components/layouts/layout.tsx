import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${silkScreen.className} ${permanentMarker.className} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
