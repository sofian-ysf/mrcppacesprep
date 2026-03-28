import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import MainWrapper from "@/app/components/MainWrapper";
import FloatingCTA from "@/app/components/FloatingCTA";
import TopBanner from "@/app/components/TopBanner";
import { GclidCapture } from "@/app/components/GclidCapture";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MRCP PACES Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate",
  description: "Pass your MRCP PACES exam first time in 2026. 2000+ practice questions, unlimited mock exams, clinical skills practice. 94% pass rate. 8,500+ candidates.",
  keywords: [
    // Primary keywords
    "MRCP PACES exam",
    "MRCP exam",
    "MRCP PACES questions",
    "MRCP PACES practice test",
    "MRCP clinical exam",
    "MRCP PACES stations",
    "MRCP PACES mock exam",
    "MRCP PACES revision",
    // Commercial intent
    "MRCP PACES exam prep cost",
    "best MRCP PACES exam preparation",
    "MRCP PACES exam prep UK",
    "affordable MRCP revision course",
    "affordable medical exam prep",
    "MRCP PACES exam preparation online",
    "MRCP PACES practice questions subscription",
    // Informational intent
    "MRCP PACES exam pass rate",
    "how to pass MRCP PACES exam",
    "MRCP PACES exam format 2026",
    "MRCP PACES exam topics",
    "MRCP PACES exam difficulty",
    "MRCP PACES exam dates UK",
    "MRCP PACES exam booking",
    "MRCP PACES retake exam",
    // Transactional intent
    "buy MRCP PACES practice questions",
    "MRCP PACES mock exam online",
    "start MRCP PACES exam prep",
    "MRCP PACES revision course signup",
    // Topic-specific keywords
    "clinical examination practice",
    "medical history taking",
    "communication skills medical",
    "clinical skills assessment",
    "clinical medicine questions",
    "medical therapeutics exam",
    "medical ethics UK",
    "clinical examination questions",
    "medicine exam questions",
    "clinical scenarios test",
    // Question format keywords
    "MRCP PACES stations",
    "MRCP PACES practice",
    "medical MCQ questions",
    "clinical examination stations",
    "PACES station practice",
    // Student type keywords
    "MRCP candidate exam",
    "medical trainee exam",
    "MBBS graduate exam",
    "medical student revision",
    "IMG exam preparation",
    "international medical graduate MRCP",
    // Location keywords
    "MRCP PACES exam prep London",
    "medical exam Manchester",
    "MRCP PACES revision Birmingham",
    "medical exam prep Leeds",
    "MRCP PACES questions Glasgow",
    "medical exam Edinburgh",
    "MRCP PACES prep Cardiff",
    "medical revision Bristol",
    // Long-tail keywords
    "pass MRCP PACES exam first time",
    "MRCP PACES exam preparation tips",
    "MRCP PACES exam study guide",
    "best MRCP PACES question bank",
    "MRCP PACES exam practice test",
    "how long to study for MRCP PACES exam",
    "MRCP PACES exam success rate",
    "MRCP PACES retake preparation",
    "clinical examination shortcuts",
    "MRCP PACES exam anxiety tips",
    // Brand awareness
    "MRCPPACESPREP",
    "MRCP PACES prep",
    "MRCP PACES Exam Prep",
    // Related searches
    "medical exam UK 2026",
    "become physician UK",
    "MRCP registration requirements",
    "medical foundation training",
    "MRCP training medicine"
  ],
  authors: [{ name: "MRCPPACESPREP" }],
  creator: "MRCPPACESPREP",
  publisher: "MRCPPACESPREP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.mrcppacesprep.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MRCP PACES Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate",
    description: "Pass your MRCP PACES exam first time in 2026. 2000+ practice questions written by physicians, unlimited mock exams, detailed explanations. 94% pass rate.",
    url: "https://www.mrcppacesprep.com",
    siteName: "MRCPPACESPREP",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.mrcppacesprep.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MRCP PACES Exam Preparation - 94% Pass Rate - 2000+ Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MRCP PACES Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate",
    description: "2000+ MRCP PACES practice questions for 2026. 94% pass rate. 8,500+ candidates. Start preparing today!",
    creator: "@mrcppacesprep",
    site: "@mrcppacesprep",
    images: ["https://www.mrcppacesprep.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// TODO: Replace with your actual GA4 Measurement ID from Google Analytics
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// Google Ads Conversion Tracking ID
const GOOGLE_ADS_ID = 'AW-17903779734';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#111827" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" type="application/rss+xml" title="MRCPPACESPREP Blog RSS" href="/feed.xml" />
        <link rel="alternate" hrefLang="en-GB" href="https://www.mrcppacesprep.com" />
        <link rel="alternate" hrefLang="x-default" href="https://www.mrcppacesprep.com" />
      </head>
      <body
        className={`${poppins.variable} antialiased font-sans`}
      >
        {/* Google Tag (gtag.js) - Google Analytics 4 + Google Ads */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Google Ads Conversion Tracking
            gtag('config', '${GOOGLE_ADS_ID}');
            ${GA_MEASUREMENT_ID ? `
            // Google Analytics 4
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });` : ''}
          `}
        </Script>

        <AuthProvider>
          {/* Capture gclid from Google Ads for conversion tracking */}
          <Suspense fallback={null}>
            <GclidCapture />
          </Suspense>
          <TopBanner />
          <NavbarWrapper />
          <FloatingCTA />
          <MainWrapper>
            {children}
          </MainWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
