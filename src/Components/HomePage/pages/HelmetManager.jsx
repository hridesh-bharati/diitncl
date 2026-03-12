import React, { useMemo } from "react"; 
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "Drishtee Computer Center";
const BASE_URL = "https://www.drishteeindia.com";
const TODAY = new Date().toISOString().split('T')[0];

const makeMeta = (titlePart, description) => ({
  title: `${titlePart} | ${BASE_TITLE}`,
  description,
});

// metaData ko static rakho (Component ke bahar)
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
  
  "/chat": { title: `Chat Support | ${BASE_TITLE}`, description: "Chat support...", noindex: true },
  "*": { title: `Page Not Found | ${BASE_TITLE}`, description: "Return to homepage." },
};

const HelmetManager = ({ children }) => {
  const { pathname } = useLocation();

  // 1. Memoize Meta Calculation: Sirf pathname badalne par hi calculation hogi
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

  // 2. Memoize Structured Data: Sabse heavy part yahi hai
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
        streetAddress: "Paragpur Road, Near Bank of Baroda", // Update as per official address
        addressLocality: "Nichlaul",
        addressRegion: "Uttar Pradesh",
        postalCode: "273304",
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: 27.3150, longitude: 83.7200 },
      telephone: "+91-7267995307",
      founder: [
        { "@type": "Person", "name": "Ajay Tiwari" },
        { "@type": "Person", "name": "Santosh Singh Chauhan" },
        { "@type": "Person", "name": "Hridesh Bharati" }
      ]
    };

    if (pathname.includes("/courses/")) {
      const courseName = pathname.split("/").pop().replace(/-/g, " ");
      const courseData = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseName.toUpperCase(),
        description: meta.description,
        provider: { "@id": `${BASE_URL}/#organization` },
        url: fullUrl,
      };
      return [orgData, courseData];
    }
    return orgData;
  }, [meta.description, pathname, fullUrl]);

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={fullUrl} />
        <meta name="robots" content={isNoIndex ? "noindex, nofollow" : "index, follow"} />
        
        {/* Open Graph & Twitter (Static images logic use karo for speed) */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={`${BASE_URL}/images/icon/logo.png`} />
        <meta name="twitter:image" content={`${BASE_URL}/images/icon/logo.png`} />
        
        {/* Optimized Structured Data injection */}
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      </Helmet>
      {children}
    </>
  );
};

export default HelmetManager;