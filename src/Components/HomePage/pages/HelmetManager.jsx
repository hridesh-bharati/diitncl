import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "Drishtee Computer Center";
const BASE_URL = "https://www.drishteeindia.com";
const TODAY = new Date().toISOString().split('T')[0];

// Helper
const makeMeta = (titlePart, description) => ({
  title: `${titlePart} | ${BASE_TITLE}`,
  description,
});

const metaData = {
  // 🏠 Home
  "/": {
    title: `${BASE_TITLE} | Best IT Training Institute in Nichlaul`,
    description:
      "Drishtee Computer Center offers professional IT training courses including Web Development, Designing, Banking, and Computer Languages in Nichlaul, Maharajganj.",
  },
  
  // ℹ️ About
  "/about": makeMeta(
    "About Us",
    "Learn about Drishtee Computer Center, our mission, vision, and expert faculty in Nichlaul, Maharajganj."
  ),
  
  // 📚 Courses
  "/courses": makeMeta(
    "All Courses",
    "Explore professional computer courses including Web Development, Python, Java, Designing, Banking, NIELIT, CCC and ADCA at Drishtee Computer Center."
  ),
  
  // 🖥️ Computer Language
  "/courses/computer-language": makeMeta(
    "Computer Language Courses",
    "Learn C, C++, Java, Python and other programming languages from expert trainers at Drishtee Computer Center."
  ),
  
  // 🎨 Designing
  "/courses/designing": makeMeta(
    "Designing Courses",
    "Professional graphic design, UI/UX, and multimedia courses with practical training in Nichlaul."
  ),
  
  // 🌐 Web Development
  "/courses/web-development": makeMeta(
    "Web Development Course",
    "Learn HTML, CSS, JavaScript, React, and full-stack web development with live projects at Drishtee."
  ),
  
  // 🏛️ NIELIT
  "/courses/nielit": makeMeta(
    "NIELIT Courses",
    "Government recognized NIELIT computer courses including CCC, O-Level, and A-Level in Maharajganj."
  ),
  
  // 💰 Banking
  "/courses/banking": makeMeta(
    "Banking Courses",
    "Specialized banking and financial computer courses for bank exams and financial sector jobs."
  ),
  
  // 📝 Course Description
  "/courses/description": makeMeta(
    "Course Details",
    "Detailed information about all computer courses offered at Drishtee Computer Center."
  ),
  
  // 🏢 Branch
  "/branch/thoothibari": makeMeta(
    "Thoothibari Branch",
    "Drishtee Computer Center Thoothibari branch - Computer training and courses in Thoothibari area."
  ),
  
  // 📍 Locations
  "/branch/nichlaul/location": makeMeta(
    "Nichlaul Location",
    "Visit Drishtee Computer Center at Nichlaul, Maharajganj. Get directions and contact information."
  ),
  
  "/branch/thoothibari/location": makeMeta(
    "Thoothibari Location",
    "Find Drishtee Computer Center in Thoothibari. Branch location, map, and contact details."
  ),
  
  // 🖼️ Gallery
  "/gallery": makeMeta(
    "Gallery",
    "See photos of Drishtee Computer Center campus, labs, classrooms, and student activities."
  ),
  
  // 📚 Library
  "/library": makeMeta(
    "Digital Library",
    "Access digital library resources, study materials, and computer books at Drishtee."
  ),
  
  // 📝 New Admission
  "/new-admission": makeMeta(
    "New Admission 2026",
    "Apply online for admission to computer courses at Drishtee Computer Center. Fill admission form now."
  ),
  
  // 📜 Download Certificate
  "/download-certificate": makeMeta(
    "Download Certificate",
    "Verify and download your computer course certificate from Drishtee Computer Center online."
  ),
  
  // 📜 Certificate Page
  "/certificate": makeMeta(
    "Certificate Verification",
    "Verify the authenticity of Drishtee Computer Center certificates online."
  ),
  
  // 📞 Contact Us
  "/contact-us": makeMeta(
    "Contact Us",
    "Contact Drishtee Computer Center for course inquiries, admission help, and support."
  ),
  
  // 🔐 Login
  "/login": makeMeta(
    "Student Login",
    "Login to your Drishtee Computer Center student dashboard to access course materials."
  ),
  
  // 💬 Chat
  "/chat": {
    title: `Chat Support | ${BASE_TITLE}`,
    description: "Chat with Drishtee Computer Center support team for instant help.",
    noindex: true, // Chat pages usually don't need indexing
  },
  
  // ❌ 404
  "*": {
    title: `Page Not Found | ${BASE_TITLE}`,
    description: "The page you are looking for does not exist. Return to Drishtee Computer Center homepage.",
  },
};

// Route Matcher with Dynamic Routes Support
function getMeta(pathname) {
  const path = pathname.toLowerCase();
  
  // Exact match
  if (metaData[path]) return metaData[path];
  
  // Dynamic routes pattern matching
  if (path.startsWith("/admin/") || path.startsWith("/student/")) {
    return { title: `Dashboard | ${BASE_TITLE}`, description: "", noindex: true };
  }
  
  return metaData["*"];
}

const HelmetManager = ({ children }) => {
  const { pathname } = useLocation();
  const meta = getMeta(pathname);

  const fullUrl = `${BASE_URL}${pathname}`.replace(/\/+$/, "");

  const isNoIndex = 
    meta.noindex === true ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") ||
    pathname === "/login" ||
    pathname === "/chat";

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${BASE_URL}/#organization`,
    name: "Drishtee Computer Center",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/images/icon/logo.png`,
    },
    description: meta.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Road, Paragpur Road",
      addressLocality: "Nichlaul",
      addressRegion: "Uttar Pradesh",
      postalCode: "273304",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.3150,
      longitude: 83.7200,
    },
    telephone: "+91-7267995307",
    email: "hridesh027@gmail.com",
    sameAs: [
      "https://www.facebook.com/drishteeindia/",
    ],
    founder: [
  {
    "@type": "Person",
    "name": "Ajay Tiwari"
  },
  {
    "@type": "Person",
    "name": "Santosh Singh Chauhan"
  },
  {
    "@type": "Person",
    "name": "Hridesh Bharati"
  }
],
    ...(!isNoIndex && {
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/courses?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    }),
  };

  // Add Course-specific structured data for course pages
  const getCourseStructuredData = () => {
    if (pathname.includes("/courses/")) {
      const courseName = pathname.split("/").pop().replace(/-/g, " ");
      return {
        "@type": "Course",
        name: courseName.toUpperCase(),
        description: meta.description,
        provider: {
          "@id": `${BASE_URL}/#organization`,
        },
        url: fullUrl,
      };
    }
    return null;
  };

  const courseData = getCourseStructuredData();
  const finalStructuredData = courseData 
    ? [structuredData, courseData] 
    : structuredData;

  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="author" content="Drishtee Computer Center - Ajay Tiwari, Santosh Singh Chauhan, Hridesh Bharati" />        <meta
          name="keywords"
          content="Drishtee Computer Center, Computer Institute Nichlaul, Computer Institute Maharajganj, Web Development Course, Python Training, Java Course, Designing Course, Banking Course, NIELIT, CCC, ADCA, Computer Classes Near Me, IT Training Maharajganj"
        />
        <meta name="theme-color" content="#00268f" />
        <link rel="canonical" href={fullUrl} />

        {/* Robots */}
        <meta
          name="robots"
          content={isNoIndex ? "noindex, nofollow" : "index, follow"}
        />

        {/* Open Graph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Drishtee Computer Center" />
        <meta property="og:image" content={`${BASE_URL}/images/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${BASE_URL}/images/og-image.jpg`} />
        <meta name="twitter:site" content="@DrishteeIndia" />

        {/* Local SEO */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Nichlaul, Maharajganj, Uttar Pradesh" />
        <meta name="geo.position" content="27.3150;83.7200" />
        <meta name="ICBM" content="27.3150, 83.7200" />

        {/* Last Modified */}
        <meta name="revised" content={TODAY} />

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
