import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "Drishtee Computer Center";
const BASE_URL = "https://www.drishteeindia.com";

const makeMeta = (titlePart, description) => ({
  title: `${titlePart} | ${BASE_TITLE}`,
  description,
});

// MetaData Configuration
const metaData = {
  "/": {
    title: `${BASE_TITLE} | Best IT Training Institute in Nichlaul`,
    description: "Drishtee Computer Center offers professional IT training courses including Web Development, Designing, Banking, and Computer Languages in Nichlaul, Maharajganj.",
  },
  "/about": makeMeta("About Us", "Learn about Drishtee Computer Center, our mission, vision, and expert faculty in Nichlaul."),
  "/courses": makeMeta("All Courses", "Explore professional computer courses including Web Development, Python, Java, CCC and ADCA."),
  "/courses/computer-language": makeMeta("Computer Language Courses", "Learn C, C++, Java, Python and other programming languages."),
  "/courses/designing": makeMeta("Designing Courses", "Professional graphic design, UI/UX, and multimedia courses."),
  "/courses/web-development": makeMeta("Web Development Course", "Learn HTML, CSS, JavaScript, React, and full-stack web development."),
  "/courses/nielit": makeMeta("NIELIT Courses", "Government recognized NIELIT computer courses including CCC and O-Level."),
  "/courses/banking": makeMeta("Banking Courses", "Specialized banking and financial computer courses for jobs."),
  "/branch/thoothibari": makeMeta("Thoothibari Branch", "Drishtee Computer Center Thoothibari branch information."),
  "/branch/nichlaul/location": makeMeta("Nichlaul Location", "Visit us at Nichlaul, Maharajganj. Get directions and contact info."),
  "/gallery": makeMeta("Gallery", "See photos of Drishtee Computer Center campus and labs."),
  "/new-admission": makeMeta("New Admission 2026", "Apply online for computer courses at Drishtee Computer Center."),
  "/download-certificate": makeMeta("Download Certificate", "Verify and download your computer course certificate online."),
  "/contact-us": makeMeta("Contact Us", "Contact Drishtee Computer Center for course inquiries."),
  "/login": makeMeta("Student Login", "Login to your student dashboard."),
  "/chat": { title: `Chat Support | ${BASE_TITLE}`, description: "Chat support...", noindex: true },
  "*": { title: `Page Not Found | ${BASE_TITLE}`, description: "Return to homepage." },
};

const HelmetManager = ({ children }) => {
  const { pathname } = useLocation();

  const meta = useMemo(() => {
    const path = pathname.toLowerCase();
    if (metaData[path]) return metaData[path];
    if (path.startsWith("/admin/") || path.startsWith("/student/")) {
      return { title: `Dashboard | ${BASE_TITLE}`, description: "", noindex: true };
    }
    return metaData["*"];
  }, [pathname]);

  const fullUrl = useMemo(() => `${BASE_URL}${pathname}`.replace(/\/+$/, ""), [pathname]);

  const isNoIndex = useMemo(() =>
    meta.noindex === true ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") ||
    ["/login", "/chat"].includes(pathname),
    [meta.noindex, pathname]);

  const finalStructuredData = useMemo(() => {
    const orgData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${BASE_URL}/#organization`,
      name: "Drishtee Computer Center",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/icon/logo.png` },
      description: meta.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Paragpur Road, Near Sunshine School Nichlaul",
        addressLocality: "Nichlaul",
        addressRegion: "Uttar Pradesh",
        postalCode: "273304",
        addressCountry: "IN",
      },
      telephone: "+91-7267995307",
      founder: [
        { "@type": "Person", "name": "Ajay Tiwari" },
        { "@type": "Person", "name": "Santosh Singh Chauhan" },
        { "@type": "Person", "name": "Hridesh Bharati" }
      ]
    };

    if (pathname.includes("/courses/")) {
      const courseName = pathname.split("/").pop().replace(/-/g, " ");
      return [orgData, {
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseName.toUpperCase(),
        description: meta.description,
        provider: { "@id": `${BASE_URL}/#organization` },
        url: fullUrl,
      }];
    }
    return orgData;
  }, [meta.description, pathname, fullUrl]);

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={fullUrl} />
        <meta name="robots" content={isNoIndex ? "noindex, nofollow" : "index, follow"} />

        {/* 🚀 Google AdSense Script (101% Working) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2660059673395664"
          crossOrigin="anonymous"
        ></script>

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={`${BASE_URL}/images/icon/logo.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${BASE_URL}/images/icon/logo.png`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      </Helmet>
      {children}
    </>
  );
};

export default HelmetManager;