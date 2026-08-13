import type { Metadata, Viewport } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme';
import AppLayout from '@/components/layout/AppLayout';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import "./globals.css";
import 'leaflet/dist/leaflet.css';

// Canonical custom domain — Firebase Hosting also serves the app on
// *.web.app / *.firebaseapp.com; we want search engines and visitors
// pointed at this one.
const CANONICAL_ORIGIN = 'https://kaeatsaan.com';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  alternates: {
    canonical: '/',
  },
  title: "KaEatSaan - Where to Eat?",
  description: "Let KaEatSaan decide where you eat! No more 'Ikaw bahala' moments.",
  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'KaEatSaan',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Script id="canonical-domain-redirect" strategy="beforeInteractive">
          {`(function(){try{var h=window.location.hostname;if(h.endsWith(".web.app")||h.endsWith(".firebaseapp.com")){window.location.replace("${CANONICAL_ORIGIN}"+window.location.pathname+window.location.search+window.location.hash);}}catch(e){}})();`}
        </Script>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
