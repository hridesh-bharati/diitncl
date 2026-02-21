import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "Drishtee Computer Center";
const BASE_URL = "https://www.drishteeindia.com";

// Helper
const makeMeta = (titlePart, description) => ({
  title: `${titlePart} | ${BASE_TITLE}`,
  description,
});

const metaData = {
  "/": {
    title: `${BASE_TITLE} | Best IT Training Institute in Maharajganj`,
    description:
      "Drishtee Computer Center offers professional IT training courses including Web Development, Designing, Banking, and Computer Languages.",
  },

  "/about": makeMeta(
    "About Us",
    "Learn about Drishtee Computer Center, our mission, vision, and expert faculty."
  ),

  "/courses": makeMeta(
    "Courses",
    "Explore professional computer courses including Web Development, Designing, Banking and more."
  ),

  "/courses/web-development": makeMeta(
    "Web Development Course",
    "Learn frontend and backend web development with practical training."
  ),

  "/courses/designing": makeMeta(
    "Designing Course",
    "Professional graphic and web designing courses with hands-on training."
  ),

  "/courses/computer-language": makeMeta(
    "Computer Language Course",
    "Learn programming languages and computer fundamentals."
  ),

  "/courses/nielit": makeMeta(
    "NIELIT Course",
    "Certified NIELIT courses and government-recognized training programs."
  ),

  "/courses/banking": makeMeta(
    "Banking Course",
    "Professional banking and finance training programs."
  ),

  "/library": makeMeta(
    "Library",
    "Access study materials and learning resources."
  ),

  "/gallery": makeMeta(
    "Gallery",
    "View student activities, classroom training, and campus gallery."
  ),

  "/branch/nichlaul": makeMeta(
    "Nichlaul Branch",
    "Visit Drishtee Computer Center Nichlaul branch for professional IT training."
  ),

  "/branch/thoothibari": makeMeta(
    "Thoothibari Branch",
    "Visit Drishtee Computer Center Thoothibari branch for IT courses."
  ),

  "/contact-us": makeMeta(
    "Contact Us",
    "Contact Drishtee Computer Center for course inquiries and support."
  ),

  "/new-admission": makeMeta(
    "New Admission",
    "Apply online for admission at Drishtee Computer Center."
  ),
  "/courses/description": makeMeta(
    "Course Description",
    "Detailed description of courses offered at Drishtee Computer Center."
  ),
  "/download-certificate": makeMeta(
    "Download Certificate",
    "Verify and download your course completion certificate."
  ),

  "/admin/*": makeMeta(
    "Admin Panel",
    "Administrative dashboard for managing students and courses."
  ),

  "/student/*": makeMeta(
    "Student Dashboard",
    "Student portal for accessing profile, certificates and enrolled courses."
  ),

  "*": {
    title: `Page Not Found | ${BASE_TITLE}`,
    description: "The page you are looking for does not exist.",
  },
};

// Route Matcher
function getMeta(pathname) {
  const path = pathname.toLowerCase();

  if (metaData[path]) return metaData[path];

  for (const key of Object.keys(metaData)) {
    if (key.endsWith("/*")) {
      const base = key.replace("/*", "");
      if (path.startsWith(base)) {
        return metaData[key];
      }
    }
  }

  return metaData["*"];
}

const HelmetManager = ({ children }) => {
  const { pathname } = useLocation();
  const meta = getMeta(pathname);

  const cleanPath = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  const fullUrl = `${BASE_URL}${cleanPath}`.replace(/\/+$/, "");

  return (
    <>
      <Helmet>
        {/* Basic */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={fullUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />

        <meta property="og:image" content={`${BASE_URL}/images/og-image.jpg`} />
        <meta name="twitter:image" content={`${BASE_URL}/images/og-image.jpg`} />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>

      {children}
    </>
  );
};

export default HelmetManager;