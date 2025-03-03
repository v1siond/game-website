import '../styles/globals.css' // Assuming your Tailwind CSS is in a file named globals.css

import localFont from "next/font/local";

const silkScreen = localFont({
  src: [
    {
      path: "../assets/fonts/Silkscreen-Regular.ttf",
      weight: '400',
      style: 'normal'
    },
    {
      path: "../assets/fonts/Silkscreen-Bold.ttf",
      weight: '700',
      style: 'normal'
    },
  ],
});

const permanentMarker = localFont({
  src: [
    {
      path: "../assets/fonts/PermanentMarker-Regular.ttf",
      weight: '400',
      style: 'normal'
    }
  ],
});

function GameWebsite({ Component, pageProps }) {
  return <Component className={`${silkScreen.className} ${permanentMarker.className}`} {...pageProps} />
}

export default GameWebsite