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
  title: "GPhC Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate",
  description: "Pass your GPhC exam first time in 2026. 2000+ practice questions, unlimited mock exams, calculations practice. 94% pass rate. 8,500+ students.",
  keywords: [
    // Primary keywords
    "GPhC exam",
    "pre-reg exam",
    "GPhC questions",
    "GPhC practice test",
    "pharmacy pre-registration exam",
    "GPhC calculation questions",
    "GPhC mock exam",
    "GPhC revision",
    // Commercial intent
    "GPhC exam prep cost",
    "best GPhC exam preparation",
    "GPhC exam prep UK",
    "cheap GPhC revision course",
    "affordable pharmacy exam prep",
    "GPhC exam preparation online",
    "GPhC practice questions subscription",
    // Informational intent
    "GPhC exam pass rate",
    "how to pass GPhC exam",
    "GPhC exam format 2026",
    "GPhC exam topics",
    "GPhC exam difficulty",
    "GPhC exam dates UK",
    "GPhC exam booking",
    "GPhC retake exam",
    // Transactional intent
    "buy GPhC practice questions",
    "GPhC mock exam online",
    "start GPhC exam prep",
    "GPhC revision course signup",
    // Topic-specific keywords
    "pharmaceutical calculations practice",
    "pharmacy dosage calculations",
    "infusion rate calculations",
    "concentration calculations pharmacy",
    "clinical pharmacy questions",
    "pharmacy therapeutics exam",
    "pharmacy law ethics UK",
    "BNF questions pharmacy",
    "pharmacology exam questions",
    "drug interactions test",
    // Question format keywords
    "GPhC SBA questions",
    "GPhC EMQ practice",
    "pharmacy MCQ questions",
    "extended matching questions pharmacy",
    "single best answer pharmacy",
    // Student type keywords
    "pre-registration pharmacist exam",
    "foundation pharmacist exam",
    "MPharm graduate exam",
    "pharmacy student revision",
    "OSPAP exam preparation",
    "international pharmacist GPhC",
    // Location keywords
    "GPhC exam prep London",
    "pharmacy exam Manchester",
    "GPhC revision Birmingham",
    "pharmacy exam prep Leeds",
    "GPhC questions Glasgow",
    "pharmacy exam Edinburgh",
    "GPhC prep Cardiff",
    "pharmacy revision Bristol",
    // Long-tail keywords
    "pass GPhC exam first time",
    "GPhC exam preparation tips",
    "GPhC exam study guide",
    "best GPhC question bank",
    "GPhC exam practice test",
    "how long to study for GPhC exam",
    "GPhC exam success rate",
    "GPhC retake preparation",
    "pharmacy calculation shortcuts",
    "GPhC exam anxiety tips",
    // Brand awareness
    "PreRegExamPrep",
    "pre-reg exam prep",
    "GPhC Exam Prep",
    // Related searches
    "pharmacy exam UK 2026",
    "become pharmacist UK",
    "GPhC registration requirements",
    "pharmacy foundation training",
    "pre-registration training pharmacy"
  ],
  authors: [{ name: "PreRegExamPrep" }],
  creator: "PreRegExamPrep",
  publisher: "PreRegExamPrep",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.preregexamprep.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GPhC Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate",
    description: "Pass your GPhC exam first time in 2026. 2000+ practice questions written by pharmacists, unlimited mock exams, detailed explanations. 94% pass rate.",
    url: "https://www.preregexamprep.com",
    siteName: "PreRegExamPrep",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.preregexamprep.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "GPhC Pre-Registration Exam Preparation - 94% Pass Rate - 2000+ Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPhC Exam Questions 2026 | 2000+ Practice Questions | 94% Pass Rate",
    description: "2000+ GPhC practice questions for 2026. 94% pass rate. 8,500+ students. Start preparing today!",
    creator: "@preregexamprep",
    site: "@preregexamprep",
    images: ["https://www.preregexamprep.com/og-image.png"],
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
        <link rel="alternate" type="application/rss+xml" title="PreRegExamPrep Blog RSS" href="/feed.xml" />
        <link rel="alternate" hrefLang="en-GB" href="https://www.preregexamprep.com" />
        <link rel="alternate" hrefLang="x-default" href="https://www.preregexamprep.com" />
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
