import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naano | The B2B LinkedIn Creator Operating System & Marketplace',
  description: 'Connect with verified LinkedIn B2B creators, launch high-impact campaigns with escrow protection, and track attributed pipeline.',
  icons: {
    icon: '/lp/naano-mark.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans antialiased text-slate-900 bg-[#FAFAFC] selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
