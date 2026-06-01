// import React from "react";
// import { Link } from "react-router-dom";
// import useScrollAnimation from "../../hooks/useScrollAnimation";

// const COURSES = [
//   { id: 1, title: "Angular JS", src: "images/course/angular-js.webp", desc: "Master corporate web architecture with comprehensive single-page application lifecycle rendering and design pattern logic." },
//   { id: 2, title: "Tally Prime", src: "images/course/tally-course.webp", desc: "Gain end-to-end expertise in advanced accounting, automated taxation compliance, GST tracking, and inventory audit mechanics." },
//   { id: 3, title: "Full Stack Development", src: "images/course/full-stack.webp", desc: "Architect dynamic microservices architectures, end-to-end relational data structures, and highly responsive user view-ports." },
//   { id: 4, title: "Mongo DB", src: "images/course/mongodb.webp", desc: "Deploy distributed document databases, cluster indexing architectures, and rapid JSON schema model configurations." },
//   { id: 5, title: "Android Development", src: "images/course/android-dev.webp", desc: "Engineer native platform applications with background services, system resource controls, and clean lifecycle management." },
//   { id: 6, title: "React JS Advance", src: "images/course/reactjs.webp", desc: "Optimize component state management trees, client-side caching schemas, and highly fast virtual reconciliation workflows." },
//   { id: 7, title: "Python Data Science", src: "images/course/python-training.webp", desc: "Execute scalable data extraction layers, automated model processing pipelines, and production predictive algorithms." },
//   { id: 8, title: "Java Mastery Course", src: "images/course/Java-full-stack.webp", desc: "Build enterprise multi-threaded environments, clean object models, and robust background runtime logic engines." }
// ];

// const CourseRow = ({ course, index }) => {
//   const isEager = index < 2;
//   // Alternating mechanism matching Screenshot 2026-06-01 204659.png
//   const isImageLeft = index % 2 === 0;

//   return (
//     <div 
//       className="row g-4 align-items-center mb-5 fade-up"
//       style={{ transitionDelay: `${index * 60}ms` }}
//     >
//       {/* Image Block */}
//       <div className={`col-12 col-md-6 ${isImageLeft ? "order-1" : "order-1 order-md-2"}`}>
//         <div className="bg-body-tertiary overflow-hidden p-2 course-img-frame border border-light-subtle shadow-sm">
//           <div className="ratio ratio-16x9">
//             <img
//               src={course.src}
//               alt={course.title}
//               className="w-100 h-100 object-fit-contain img-zoom-effect"
//               loading={isEager ? "eager" : "lazy"}
//               decoding="async"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Text Content Block */}
//       <div className={`col-12 col-md-6 ${isImageLeft ? "order-2" : "order-2 order-md-1"}`}>
//         <div className={`p-2 p-lg-4 ${isImageLeft ? "text-start ps-md-4" : "text-start pe-md-4"}`}>
          
//           <span className="course-mini-badge text-uppercase mb-2 d-inline-block">
//             VERIFIED PROGRAM
//           </span>
          
//           <h3 className="fw-extrabold text-dark tracking-tight mb-3 fs-4">
//             {course.title}
//           </h3>
          
//           <p className="text-secondary small lh-base mb-4 course-desc-text">
//             {course.desc}
//           </p>

//           <div className="d-flex align-items-center gap-3">
//             <Link
//               to="/courses"
//               className="btn btn-dark-red text-white font-monospace text-uppercase fw-bold rounded-0 px-4 py-2 text-center fs-7 shadow-sm border-0 tracking-wider transition-all"
//             >
//               Learn More &rarr;
//             </Link>
//             <span className="badge bg-light text-dark border border-secondary-subtle font-monospace text-uppercase tracking-normal py-2 px-3 fw-semibold fs-8 rounded-0">
//               <i className="bi bi-shield-check text-success me-1"></i> JOB ORIENTED
//             </span>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default function TopCourseList() {
//   useScrollAnimation();

//   return (
//     <section className="py-5 bg-white overflow-hidden">
//       <div className="container py-2">

//         {/* Header Layout */}
//         <div className="d-flex justify-content-between align-items-end mb-5 pb-3 border-b-light">
//           <div>
//             <span className="text-muted tracking-wider fw-bold font-monospace fs-8 text-uppercase mb-1 d-block">
//               CURRICULUM ECOSYSTEM
//             </span>
//             <h2 className="fw-black text-dark mb-0 fs-3 text-uppercase tracking-tight">
//               Top Academic Programs
//             </h2>
//           </div>
//           <Link
//             to="/courses"
//             className="text-decoration-none fw-bold font-monospace tracking-wider text-dark-red fs-7"
//           >
//             SEE ALL &gt;&gt;
//           </Link>
//         </div>

//         {/* Alternating Row Stack */}
//         <div className="course-stack-wrapper">
//           {COURSES.map((course, index) => (
//             <CourseRow key={course.id} course={course} index={index} />
//           ))}
//         </div>

//       </div>

//       {/* Production-grade performance inline layout rules */}
//       <style>{`
//         .fw-black { font-weight: 900; }
//         .fw-extrabold { font-weight: 800; }
//         .fs-7 { font-size: 0.8rem; }
//         .fs-8 { font-size: 0.72rem; }
//         .text-dark-red { color: #990011 !important; }
//         .btn-dark-red { background-color: #990011 !important; }
//         .btn-dark-red:hover { background-color: #7a000d !important; transform: translateX(2px); }
//         .tracking-wider { letter-spacing: 1.5px; }
//         .tracking-tight { letter-spacing: -0.5px; }
//         .border-b-light { border-bottom: 2px solid #f1f5f9; }
        
//         .course-mini-badge {
//           font-size: 10px;
//           color: #990011;
//           font-weight: 700;
//           letter-spacing: 1px;
//         }

//         .course-desc-text {
//           color: #475569 !important;
//           max-width: 520px;
//         }

//         /* Sharp Border Framed Wrapper matching image spec */
//         .course-img-frame {
//           background-color: #ffffff !important;
//           border-radius: 0px !important;
//           border: 1px solid #e2e8f0 !important;
//         }

//         .img-zoom-effect {
//           transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//         }
        
//         .course-img-frame:hover .img-zoom-effect {
//           transform: scale(1.03);
//         }

//         .transition-all {
//           transition: all 0.2s ease-in-out;
//         }
//       `}</style>
//     </section>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";

// Rich Dataset loaded with contextual target keywords for local & global tech SEO mapping
const COURSES = [
  { 
    id: 1, 
    title: "Angular JS Front-End Architecture", 
    src: "images/course/angular-js.webp", 
    desc: "Master corporate web architecture with comprehensive single-page application lifecycle rendering and design pattern logic.",
    duration: "12 Weeks",
    lectures: "48 Sessions",
    skillsLearned: ["TypeScript", "SPA Routing", "State Management", "RxJS Observables", "Enterprise Design Patterns"]
  },
  { 
    id: 2, 
    title: "Tally Prime & GST Compliance Professional", 
    src: "images/course/tally-course.webp", 
    desc: "Gain end-to-end expertise in advanced accounting, automated taxation compliance, GST tracking, and inventory audit mechanics.",
    duration: "8 Weeks",
    lectures: "32 Sessions",
    skillsLearned: ["Corporate E-Way Bill", "TDS Filing", "Ledger Management", "Balance Sheet Analysis", "Tax Audits"]
  },
  { 
    id: 3, 
    title: "Full Stack Software Development Masterclass", 
    src: "images/course/full-stack.webp", 
    desc: "Architect dynamic microservices architectures, end-to-end relational data structures, and highly responsive user view-ports.",
    duration: "24 Weeks",
    lectures: "96 Sessions",
    skillsLearned: ["MERN Stack", "REST APIs", "SQL/NoSQL Databases", "DevOps Deployment", "System Architecture"]
  },
  { 
    id: 4, 
    title: "MongoDB Database Engineering & Administration", 
    src: "images/course/mongodb.webp", 
    desc: "Deploy distributed document databases, cluster indexing architectures, and rapid JSON schema model configurations.",
    duration: "6 Weeks",
    lectures: "24 Sessions",
    skillsLearned: ["NoSQL Scalability", "Aggregation Pipeline", "Sharding", "Data Replica Sets", "JSON Schema Modeling"]
  },
  { 
    id: 5, 
    title: "Native Android Platform Application Development", 
    src: "images/course/android-dev.webp", 
    desc: "Engineer native platform applications with background services, system resource controls, and clean lifecycle management.",
    duration: "16 Weeks",
    lectures: "64 Sessions",
    skillsLearned: ["Kotlin Core", "Android Jetpack", "Background Services", "API Integrations", "App Store Deployment"]
  },
  { 
    id: 6, 
    title: "Advanced React JS & State Management Optimization", 
    src: "images/course/reactjs.webp", 
    desc: "Optimize component state management trees, client-side caching schemas, and highly fast virtual reconciliation workflows.",
    duration: "10 Weeks",
    lectures: "40 Sessions",
    skillsLearned: ["Hooks API", "Redux Toolkit", "Next.js SSR", "Performance Profiling", "Virtual DOM Caching"]
  },
  { 
    id: 7, 
    title: "Python Data Science & Machine Learning Pipelines", 
    src: "images/course/python-training.webp", 
    desc: "Execute scalable data extraction layers, automated model processing pipelines, and production predictive algorithms.",
    duration: "20 Weeks",
    lectures: "80 Sessions",
    skillsLearned: ["Predictive Analytics", "Pandas Dataframes", "Scikit-Learn", "Automated ETL Pipelines", "Data Visualization"]
  },
  { 
    id: 8, 
    title: "Java Enterprise Systems & Mastery Course", 
    src: "images/course/Java-full-stack.webp", 
    desc: "Build enterprise multi-threaded environments, clean object models, and robust background runtime logic engines.",
    duration: "18 Weeks",
    lectures: "72 Sessions",
    skillsLearned: ["Multithreading", "Spring Boot", "Hibernate ORM", "Microservices", "Secure Runtime Architectures"]
  }
];

const CourseRow = ({ course, index }) => {
  const isEager = index < 2;
  const isImageLeft = index % 2 === 0;

  return (
    <article 
      className="row g-4 align-items-center mb-5pb-4 course-panel-row fade-up"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image Block */}
      <div className={`col-12 col-md-6 ${isImageLeft ? "order-1" : "order-1 order-md-2"}`}>
        <div className="bg-body-tertiary overflow-hidden p-2 course-img-frame border border-light-subtle shadow-sm">
          <div className="ratio ratio-16x9 bg-white">
            <img
              src={course.src}
              alt={`${course.title} certification training class modules`}
              className="w-100 h-100 object-fit-contain img-zoom-effect"
              loading={isEager ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Text Content Block */}
      <div className={`col-12 col-md-6 ${isImageLeft ? "order-2" : "order-2 order-md-1"}`}>
        <div className={`p-2 py-lg-4 ${isImageLeft ? "text-start ps-md-4" : "text-start pe-md-4"}`}>
          
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="course-mini-badge text-uppercase">
              VERIFIED PROGRAM
            </span>
            <span className="bullet-divider">&bull;</span>
            <span className="text-muted font-monospace seo-meta-text">{course.duration} ({course.lectures})</span>
          </div>
          
          <h3 className="fw-extrabold text-dark tracking-tight mb-3 fs-4">
            {course.title}
          </h3>
          
          <p className="text-secondary small lh-base mb-3 course-desc-text">
            {course.desc}
          </p>

          {/* New SEO Targeted Keyword Chips Layout */}
          <div className="mb-4">
            <p className="text-dark small fw-bold font-monospace text-uppercase tracking-wider mb-2 fs-9">Core Modules Covered:</p>
            <div className="d-flex flex-wrap gap-1.5 keyword-pill-wrapper">
              {course.skillsLearned.map((skill, idx) => (
                <span key={idx} className="seo-keyword-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Link
              to="/courses"
              className="btn btn-dark-red text-white font-monospace text-uppercase fw-bold rounded-0 px-4 py-2 text-center fs-7 shadow-sm border-0 tracking-wider transition-all"
            >
              Explore Curriculum &rarr;
            </Link>
            <span className="badge bg-light text-dark border border-secondary-subtle font-monospace text-uppercase tracking-normal py-2 px-3 fw-semibold fs-8 rounded-0">
              <i className="bi bi-shield-check text-success me-1"></i> JOB ORIENTED
            </span>
          </div>

        </div>
      </div>
    </article>
  );
};

export default function TopCourseList() {
  useScrollAnimation();

  return (
    <section className="py-5 px-0 bg-white overflow-hidden" aria-label="Professional Technical Computer Programs">
      <div className="container py-2">

        {/* Header Layout */}
        <div className="d-flex justify-content-between align-items-end mb-5 pb-3 border-b-light">
          <div>
            <span className="text-muted tracking-wider fw-bold font-monospace fs-8 text-uppercase mb-1 d-block">
              CURRICULUM ECOSYSTEM
            </span>
            <h2 className="fw-black text-dark mb-0 fs-3 text-uppercase tracking-tight">
              Top Academic <span className="text-dark-red">Programs</span>
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-decoration-none fw-bold font-monospace tracking-wider text-dark-red fs-7 text-nowrap"
          >
            SEE ALL &gt;&gt;
          </Link>
        </div>

        {/* Alternating Row Stack */}
        <div className="course-stack-wrapper">
          {COURSES.map((course, index) => (
            <CourseRow key={course.id} course={course} index={index} />
          ))}
        </div>

      </div>

      {/* Production-grade performance inline layout rules */}
      <style>{`
        .fw-black { font-weight: 900; }
        .fw-extrabold { font-weight: 800; }
        .fs-7 { font-size: 0.8rem; }
        .fs-8 { font-size: 0.72rem; }
        .fs-9 { font-size: 0.65rem; }
        .text-dark-red { color: #990011 !important; }
        .btn-dark-red { background-color: #990011 !important; }
        .btn-dark-red:hover { background-color: #7a000d !important; transform: translateX(2px); }
        .tracking-wider { letter-spacing: 1.5px; }
        .tracking-tight { letter-spacing: -0.5px; }
        .border-b-light { border-bottom: 2px solid #f1f5f9; }
        .text-nowrap { white-space: nowrap; }
        
        .course-mini-badge {
          font-size: 10px;
          color: #990011;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .bullet-divider {
          color: #cbd5e1;
          font-size: 0.8rem;
        }

        .seo-meta-text {
          font-size: 0.72rem;
          font-weight: 600;
        }

        .course-desc-text {
          color: #475569 !important;
          max-width: 520px;
        }

        /* SEO Keyword Tags Styling */
        .keyword-pill-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .seo-keyword-pill {
          font-size: 0.7rem;
          background-color: #f8fafc;
          color: #475569;
          padding: 3px 8px;
          border: 1px solid #e2e8f0;
          font-weight: 500;
          border-radius: 2px;
          display: inline-block;
        }

        /* Sharp Border Framed Wrapper matching image spec */
        .course-img-frame {
          background-color: #ffffff !important;
          border-radius: 0px !important;
          border: 1px solid #e2e8f0 !important;
        }

        .img-zoom-effect {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .course-panel-row:hover .img-zoom-effect {
          transform: scale(1.025);
        }

        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        
        .mb-5pb-4 {
          margin-bottom: 3.5rem;
        }
      `}</style>
    </section>
  );
}