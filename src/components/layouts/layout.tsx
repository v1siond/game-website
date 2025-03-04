import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../styles/globals.css";

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
});

const permanentMarker = localFont({
  src: [
    {
      path: "../../assets/fonts/PermanentMarker-Regular.ttf",
      weight: '400',
      style: 'normal'
    }
  ],
});

export const metadata: Metadata = {
  title: "Alexander Pulido's Website",
  description: "Personal website from Senior Developer Alexander Pulido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${silkScreen.className} ${permanentMarker.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
