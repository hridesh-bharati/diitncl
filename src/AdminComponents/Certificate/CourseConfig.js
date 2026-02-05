// src/AdminComponents/Certificate/CourseConfig.js

export const COURSE_CONFIG = {
  ADCA: {
    code: "ADCA",
    fullName: "Advance Diploma in Computer Application",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-PowerPoint",
      "MS-Excel",
      "MS-Access",
      "Tally 9.2 with Inventory & Taxation",
      "Internet & E-mail",
      "Photoshop",
      "PageMaker",
      "Corel Draw",
      "C & C++",
      "Virus",
      "HTML",
      "Java Script",
      "MS Front page",
      "Hardware & Its Fault",
      "Project Development"
    ],
    hours: "580 Hrs."
  },
  DCAA: {
    code: "DCAA",
    fullName: "Diploma in Computer Accounting Application",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-PowerPoint",
      "MS-Excel",
      "MS-Access",
      "Tally 9.2 with Inventory & Taxation",
      "Internet & E-mail"
    ],
    hours: "320 Hrs."
  },
  DCA: {
    code: "DCA",
    fullName: "Diploma in Computer Application",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-PowerPoint",
      "MS-Excel",
      "MS-Access",
      "Tally 9.2 with Inventory & Taxation",
      "Internet & E-mail",
      "Photoshop",
      "PageMaker",
      "Corel Draw",
      "C & C++"
    ],
    hours: "480 Hrs."
  }
};

// ✅ Helper returns null if no valid course
export const getCourseData = (courseCode) => {
  if (!courseCode) return null;

  const course = courseCode.toUpperCase().trim();

  if (course.includes("ADCA") || course.includes("ADVANCE DIPLOMA")) return COURSE_CONFIG.ADCA;
  if (course.includes("DCAA")) return COURSE_CONFIG.DCAA;
  if (course.includes("DCA")) return COURSE_CONFIG.DCA;

  return null; // fallback
};
