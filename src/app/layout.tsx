import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.eatnudes.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "NUDES™ — Health Bar Barcelona & Madrid",
    template: "%s | NUDES™",
  },

  description:
    "Ceremonial matcha, açaí soft serve, fresh rolls and smoothies. NUDES™ is Barcelona and Madrid's stripped-back health bar. No filler, ever. Find us in El Born, Barcelona.",

  keywords: [
    "health bar Barcelona",
    "health bar Madrid",
    "healthy food El Born",
    "açaí Barcelona",
    "matcha Barcelona",
    "ceremonial matcha Barcelona",
    "smoothies Barcelona",
    "fresh rolls Barcelona",
    "vegan Barcelona",
    "gluten free Barcelona",
    "NUDES Barcelona",
    "eat nudes",
    "healthy grab and go Barcelona",
    "Carrer del Rec",
    "El Born",
    "comida sana Barcelona",
    "barra de salud Barcelona",
    "açaí bowl Barcelona",
    "protein shake Barcelona",
  ],

  authors: [{ name: "NUDES™", url: siteUrl }],
  creator: "NUDES™",
  publisher: "NUDES™",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    alternateLocale: ["es_ES"],
    url: siteUrl,
    siteName: "NUDES™",
    title: "NUDES™ — Health Bar Barcelona & Madrid",
    description:
      "Ceremonial matcha, açaí soft serve, fresh rolls and smoothies. Barcelona and Madrid's favourite stripped-back health bar. Nothing to hide.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NUDES™ — Nothing to Hide. Health bar in Barcelona and Madrid.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NUDES™ — Health Bar Barcelona & Madrid",
    description:
      "Ceremonial matcha, açaí soft serve, fresh rolls. Nothing to hide.",
    images: ["/opengraph-image.png"],
    site: "@eat.nudes",
    creator: "@eat.nudes",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  alternates: {
    canonical: siteUrl,
    languages: {
      en: siteUrl,
      es: `${siteUrl}/es`,
    },
  },

  category: "food",
};

// JSON-LD structured data — Restaurant (x2) + WebSite + Organization
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": `${siteUrl}/#barcelona`,
      name: "NUDES™",
      description:
        "Barcelona's stripped-back health bar. Ceremonial matcha, açaí soft serve, fresh rolls and smoothies. No filler, ever.",
      url: siteUrl,
      telephone: "+34696531012",
      email: "info@eatnudes.com",
      image: `${siteUrl}/logo.png`,
      priceRange: "€€",
      servesCuisine: [
        "Healthy",
        "Vegan",
        "Vegetarian",
        "Açaí Bowls",
        "Smoothies",
        "Matcha",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carrer del Rec, 10",
        addressLocality: "Barcelona",
        addressRegion: "Catalonia",
        postalCode: "08003",
        addressCountry: "ES",
      },
      hasMap: "https://maps.google.com/?q=Carrer+del+Rec+10+Barcelona",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "08:00",
          closes: "22:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday"],
          opens: "09:00",
          closes: "22:00",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.6",
        reviewCount: "1322",
        bestRating: "5",
        worstRating: "1",
      },
      sameAs: ["https://www.instagram.com/eat.nudes/"],
      menu: siteUrl,
    },
    {
      "@type": "Restaurant",
      "@id": `${siteUrl}/#madrid`,
      name: "NUDES™ Madrid",
      description:
        "Madrid's stripped-back health bar by NUDES™. Ceremonial matcha, açaí soft serve, fresh rolls and smoothies.",
      url: siteUrl,
      email: "info@eatnudes.com",
      image: `${siteUrl}/logo.png`,
      priceRange: "€€",
      servesCuisine: [
        "Healthy",
        "Vegan",
        "Vegetarian",
        "Açaí Bowls",
        "Smoothies",
        "Matcha",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle San Mateo, 30",
        addressLocality: "Madrid",
        postalCode: "28004",
        addressCountry: "ES",
      },
      hasMap: "https://maps.google.com/?q=Calle+San+Mateo+30+Madrid",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "08:00",
          closes: "22:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday"],
          opens: "09:00",
          closes: "22:00",
        },
      ],
      sameAs: ["https://www.instagram.com/eat.nudes/"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "NUDES™",
      description:
        "Barcelona and Madrid's favourite stripped-back health bar.",
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "NUDES™",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      sameAs: ["https://www.instagram.com/eat.nudes/"],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+34696531012",
        email: "info@eatnudes.com",
        contactType: "customer service",
        availableLanguage: ["English", "Spanish"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
