import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_TITLE = "Drishtee Computer Center";
const BASE_URL = "https://www.drishteeindia.com/"; 

// Helper
const makeMeta = (titlePart, description) => ({
  title: `${titlePart} | ${BASE_TITLE}`,
  description,
});

// 🔥 SEO Meta Data
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

  "/ourcourses": makeMeta(
    "Our Courses",
    "Explore professional computer courses including Web Development, Designing, Banking and more."
  ),

  "/branch": makeMeta(
    "Our Branches",
    "Find Drishtee Computer Center branches and contact details."
  ),

  "/gallery": makeMeta(
    "Gallery",
    "View student activities, classroom training, and campus gallery."
  ),

  "/new-admission": makeMeta(
    "New Admission",
    "Apply online for admission at Drishtee Computer Center."
  ),

  "/download-certificate": makeMeta(
    "Download Certificate",
    "Verify and download your course completion certificate."
  ),

  "/contact-us": makeMeta(
    "Contact Us",
    "Contact Drishtee Computer Center for queries and support."
  ),

  "/computerlanguage": makeMeta(
    "Computer Languages Course",
    "Learn programming languages and computer fundamentals."
  ),

  "/designing": makeMeta(
    "Designing Course",
    "Professional graphic and web designing courses."
  ),

  "/webdev": makeMeta(
    "Web Development Course",
    "Learn frontend and backend web development."
  ),

  "/nielet": makeMeta(
    "NIELIT Course",
    "Certified NIELIT courses and training programs."
  ),

  "/banking": makeMeta(
    "Banking Course",
    "Professional banking and finance training programs."
  ),

  "/library": makeMeta(
    "Library",
    "Access study materials and learning resources."
  ),

  "/admin/*": makeMeta(
    "Admin Panel",
    "Administrative dashboard for managing students and courses."
  ),

  "/student/*": makeMeta(
    "Student Dashboard",
    "Student portal for accessing profile, certificates and courses."
  ),

  "*": {
    title: `Page Not Found | ${BASE_TITLE}`,
    description: "The page you are looking for does not exist.",
  },
};

// 🔥 Route Matcher
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

  const fullUrl = `${BASE_URL}${pathname}`;

  return (
    <>
      <Helmet>
        {/* ✅ Basic */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={fullUrl} />

        {/* ✅ Open Graph (Facebook) */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />

        {/* ✅ Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />

        {/* ✅ Robots */}
        <meta name="robots" content="index, follow" />
      </Helmet>

      {children}
    </>
  );
};

export default HelmetManager;