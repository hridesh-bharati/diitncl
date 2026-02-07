export const COURSE_CONFIG = {
  ADCA_PLUS: {
    code: "ADCA+",
    fullName: "Advance Diploma in Computer Application (Plus)",
    duration: "18 Months",
    hours: "580 Hrs.",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-PowerPoint",
      "MS-Excel",
      "MS-Access",
      "Tally with GST",
      "Internet & E-mail",
      "Photoshop",
      "PageMaker",
      "Corel Draw",
      "C & C++",
      "HTML",
      "JavaScript",
      "Project Development"
    ]
  },

  ADCA: {
    code: "ADCA",
    fullName: "Advance Diploma in Computer Application",
    duration: "15 Months",
    hours: "580 Hrs.",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-PowerPoint",
      "MS-Excel",
      "MS-Access",
      "Tally with GST",
      "Internet & E-mail",
      "Photoshop",
      "PageMaker",
      "Corel Draw",
      "C & C++",
      "HTML",
      "JavaScript",
      "Project Development"
    ]
  },

  DCA: {
    code: "DCA",
    fullName: "Diploma in Computer Application",
    duration: "12 Months",
    hours: "480 Hrs.",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-PowerPoint",
      "MS-Excel",
      "MS-Access",
      "Internet & E-mail",
      "Photoshop",
      "C Programming"
    ]
  },

  DCAA: {
    code: "DCAA",
    fullName: "Diploma in Computer Accounting Application",
    duration: "6 Months",
    hours: "320 Hrs.",
    modules: [
      "Computer fundamentals",
      "MS-Windows",
      "MS-Word",
      "MS-Excel",
      "Tally with GST",
      "Internet & E-mail"
    ]
  }
};

// 🔥 SINGLE SOURCE OF TRUTH
export const getCourseData = (courseCode) => {
  if (!courseCode) return null;

  const course = courseCode.toUpperCase().trim();

  if (course.includes("ADCA+")) return COURSE_CONFIG.ADCA_PLUS;
  if (course.includes("ADCA")) return COURSE_CONFIG.ADCA;
  if (course.includes("DCAA")) return COURSE_CONFIG.DCAA;
  if (course.includes("DCA")) return COURSE_CONFIG.DCA;

  return null;
};
