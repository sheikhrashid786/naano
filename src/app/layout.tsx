import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naano: B2B LinkedIn Creator Marketplace',
  description: 'Naano helps B2B SaaS brands run fixed-price LinkedIn creator campaigns and trace attributed clicks and leads back to each post.',
  icons: {
    icon: '/lp/naano-logo-nav.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/naano_master.css" />
      </head>
      <body className="min-h-full font-sans antialiased text-[#17181C] bg-[#FCFCFB]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
