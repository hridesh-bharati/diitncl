import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "Drishtee Computer Center";
const BASE_URL = "https://www.drishteeindia.com";
const DEFAULT_IMAGE = "https://www.drishteeindia.com/images/icon/logo.png";

const makeMeta = (titlePart, description, keywords = "", noindex = false) => ({
  title: `${titlePart} | ${BASE_TITLE}`,
  description,
  keywords,
  noindex,
});

const metaData = {
  "/": {
    title: "Drishtee Computer Center | Best IT Training Institute in Nichlaul",
    description: "Government recognized IT training institute in Nichlaul offering CCC, ADCA, Web Development, Python, Tally, and NIELIT courses.",
    keywords: "computer institute, CCC course, ADCA course, Python classes, Web Development, Nichlaul computer center",
  },
  "/about": makeMeta("About Us", "Learn about Drishtee Computer Center, expert faculty, infrastructure, and career-focused computer education programs."),
  "/courses": makeMeta("All Courses", "Explore professional IT and computer courses including CCC, ADCA, Tally, Python, Web Development, and Designing."),
  "/courses/web-development": makeMeta("Web Development Course", "Learn HTML, CSS, JavaScript, React, Node.js, PHP, and MySQL with practical projects and placement support."),
  "/courses/nielit": makeMeta("NIELIT CCC Course", "Government recognized CCC and NIELIT certification courses for jobs and higher education."),
  "/contact-us": makeMeta("Contact Us", "Contact Drishtee Computer Center for admission, courses, certificate verification, and support."),
  "/gallery": makeMeta("Gallery", "Explore labs, classrooms, student activities, events, and certificate distribution photos."),
  "/download-certificate": makeMeta("Certificate Verification", "Verify and download authentic Drishtee Computer Center certificates online."),
  "/new-admission": makeMeta("Admission Open", "Apply online for admission in CCC, ADCA, Tally, Python, and Web Development courses."),
  "/privacy-policy": makeMeta("Privacy Policy", "Read how Drishtee Computer Center protects and manages user information."),
  "/terms-conditions": makeMeta("Terms and Conditions", "Terms and conditions for using Drishtee Computer Center website and services."),
  
  // --- FAQ Meta Data added here ---
  "/faq": makeMeta("Frequently Asked Questions", "Find answers to common questions about admissions, courses, placement support, and certificates at Drishtee Computer Center.", "FAQ, computer center questions, admission help, Drishtee FAQ"),
  
  "/login": makeMeta("Student Login", "Student login dashboard for notes, certificates, assignments, and progress tracking.", "", true),
  "/chat": { title: `Live Chat | ${BASE_TITLE}`, description: "Live support chat for admission, courses, and certificate verification.", noindex: true },
  "*": { title: `Page Not Found | ${BASE_TITLE}`, description: "The page you are looking for does not exist.", noindex: true },
};

const HelmetManager = ({ children }) => {
  const { pathname } = useLocation();

  const cleanPath = useMemo(() => {
    const path = pathname.toLowerCase().trim();
    return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  }, [pathname]);

  const meta = useMemo(() => {
    if (metaData[cleanPath]) return metaData[cleanPath];

    if (cleanPath.startsWith("/admin") || cleanPath.startsWith("/student") || cleanPath.startsWith("/dashboard")) {
      return { title: `Dashboard | ${BASE_TITLE}`, description: "Secure dashboard area.", noindex: true };
    }

    if (cleanPath.startsWith("/courses/")) {
      const slug = cleanPath.split("/").pop().replace(/-/g, " ");
      const formatted = slug.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

      return makeMeta(
        formatted,
        `Learn ${formatted} at Drishtee Computer Center with practical training and placement support.`,
        `${formatted}, ${formatted} course, computer course`
      );
    }

    return metaData["*"];
  }, [cleanPath]);

  const fullUrl = useMemo(() => `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`, [cleanPath]);
  const isNoIndex = useMemo(() => meta.noindex === true, [meta.noindex]);

  const structuredData = useMemo(() => {
    const organization = {
      "@context": "https://schema.org",
      "@type": "ComputerSchool",
      "@id": `${BASE_URL}/#organization`,
      name: BASE_TITLE,
      url: BASE_URL,
      logo: DEFAULT_IMAGE,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Paragpur Road, Near Sunshine School",
        addressLocality: "Nichlaul",
        addressRegion: "Uttar Pradesh",
        postalCode: "273304",
        addressCountry: "IN",
      },
      telephone: "+91-7267995307"
    };

    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: BASE_URL,
      name: BASE_TITLE,
    };

    const data = [organization, website];

    // Course Data & Breadcrumb
    if (cleanPath.startsWith("/courses/")) {
      const courseTitle = meta.title.split("|")[0].trim();

      data.push({
        "@context": "https://schema.org",
        "@type": "Course",
        name: meta.title,
        description: meta.description,
        provider: { "@id": `${BASE_URL}/#organization` },
      });

      data.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Courses", "item": `${BASE_URL}/courses` },
          { "@type": "ListItem", "position": 3, "name": courseTitle, "item": fullUrl }
        ]
      });
    }

    // --- FAQ Page Schema added here ---
    if (cleanPath === "/faq" || cleanPath === "/about/faq") {
      data.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Drishtee Computer Center में कौन-कौन से कोर्स उपलब्ध हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "हमारे यहाँ CCC, ADCA, Web Development, Python, Tally Prime, और NIELIT सर्टिफिकेशन कोर्सेज उपलब्ध हैं।"
            }
          },
          {
            "@type": "Question",
            "name": "क्या यहाँ से मिलने वाला सर्टिफिकेट सरकारी नौकरियों के लिए मान्य है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "हाँ, Drishtee Computer Center एक गवर्नमेंट रिकॉग्नाइज्ड (मान्यता प्राप्त) संस्थान है। हमारे सर्टिफिकेट्स और NIELIT CCC सर्टिफिकेट सभी सरकारी और प्राइवेट नौकरियों के लिए पूरी तरह मान्य हैं।"
            }
          },
          {
            "@type": "Question",
            "name": "क्या एडमिशन के लिए ऑनलाइन अप्लाई कर सकते हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "हाँ, आप हमारी वेबसाइट पर 'New Admission' पेज पर जाकर किसी भी कोर्स के लिए ऑनलाइन आवेदन कर सकते हैं।"
            }
          },
          {
            "@type": "Question",
            "name": "क्या सर्टिफिकेट को ऑनलाइन वेरीफाई किया जा सकता है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "बिलकुल, छात्र हमारे 'Certificate Verification' पेज पर जाकर अपना रोल नंबर या सर्टिफिकेट नंबर डालकर उसे ऑनलाइन चेक और डाउनलोड कर सकते हैं।"
            }
          }
        ]
      });
    }

    return data;
  }, [cleanPath, meta, fullUrl]);

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords || ""} />
        <meta name="robots" content={isNoIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
        <meta name="googlebot" content={isNoIndex ? "noindex, nofollow" : "index, follow"} />
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta property="og:site_name" content={BASE_TITLE} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />

        <meta name="author" content={BASE_TITLE} />
        <meta name="language" content="English" />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      {children}
    </>
  );
};

export default HelmetManager;