
/* backend/latex/generateResumeLatex.js */

/**
 * Escapes special LaTeX characters.
 */
const escapeLatex = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}")
    .replace(/\|/g, "\\textbar{}");
};

/**
 * Helper to formatting links (removing https:// etc for display)
 */
const cleanLink = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
};

/**
 * Generates the LaTeX string based on the provided resume data.
 * Adheres strictly to the "Shubham Kendre" format/template.
 */
export const generateResumeLatex = (resume) => {
  if (!resume) return "";

  const {
    personal_info = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
    achievements = [],
  } = resume;

  // --- HEADER SECTION ---
  const headerLinks = [];
  if (personal_info.email) headerLinks.push(`\\href{mailto:${personal_info.email}}{${escapeLatex(personal_info.email)}}`);
  if (personal_info.phone) headerLinks.push(escapeLatex(personal_info.phone));
  if (personal_info.linkedin) headerLinks.push(`\\href{${personal_info.linkedin}}{${escapeLatex(cleanLink(personal_info.linkedin))}}`);
  if (personal_info.github) headerLinks.push(`\\href{${personal_info.github}}{${escapeLatex(cleanLink(personal_info.github))}}`);
  if (personal_info.location) headerLinks.push(escapeLatex(personal_info.location));

  const headerLatex = `
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personal_info.fullName || "Name")}} \\\\ \\vspace{1pt}
    \\small ${headerLinks.join(" $|$ ")}
\\end{center}
`;

  // --- EDUCATION SECTION ---
  const educationLatex = education.length > 0 ? `
\\section{Education}
\\resumeSubHeadingListStart
${education.map(edu => `
  \\resumeSubheading
    {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
    {${escapeLatex(edu.degree)}}{${escapeLatex(edu.graduationDate || edu.date)}}
`).join("")}
\\resumeSubHeadingListEnd
` : "";

  // --- SKILLS SECTION ---
  // Handle skills: can be string (legacy), array of objects, or object
  let skillsContent = "";

  if (typeof skills === 'string' && skills.trim()) {
    // Legacy string format
    skillsContent = `\\textbf{Technical Skills:} ${escapeLatex(skills)} \\\\`;
  } else if (Array.isArray(skills)) {
    // Array of objects [{ category: "Lang", items: "C, Java" }] or strings
    if (skills.length > 0 && typeof skills[0] === 'string') {
      skillsContent = `\\textbf{Technical Skills:} ${escapeLatex(skills.join(", "))} \\\\`;
    } else {
      skillsContent = skills.map(skillGroup =>
        `\\textbf{${escapeLatex(skillGroup.category || skillGroup.name)}:} ${escapeLatex(Array.isArray(skillGroup.items) ? skillGroup.items.join(", ") : skillGroup.items)} \\\\`
      ).join("\n");
    }
  } else if (typeof skills === 'object' && skills !== null) {
    // Object format { "Languages": "C, Java" }
    skillsContent = Object.entries(skills).map(([category, items]) =>
      `\\textbf{${escapeLatex(category)}:} ${escapeLatex(Array.isArray(items) ? items.join(", ") : items)} \\\\`
    ).join("\n");
  }

  const skillsLatex = skillsContent ? `
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
${skillsContent}
}}
\\end{itemize}
` : "";

  // --- EXPERIENCE SECTION ---
  const experienceLatex = experience.length > 0 ? `
\\section{Experience}
\\resumeSubHeadingListStart
${experience.map(exp => {
    const descriptionBullets = (exp.description || "").split("\\n").filter(line => line.trim() !== "");
    const bulletItems = descriptionBullets.map(d => `\\resumeItem{${escapeLatex(d)}}`).join("\n");
    return `
  \\resumeSubheading
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
    {${escapeLatex(exp.position)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
  \\resumeItemListStart
    ${bulletItems}
  \\resumeItemListEnd
    `;
  }).join("")}
\\resumeSubHeadingListEnd
` : "";

  // --- PROJECTS SECTION ---
  const projectsLatex = projects.length > 0 ? `
\\section{Projects}
\\resumeSubHeadingListStart
${projects.map(proj => {
    const techStack = proj.tech ? ` $|$ \\emph{${escapeLatex(proj.tech)}}` : "";
    const bulletItems = (proj.points || []).map(p => `\\resumeItem{${escapeLatex(p)}}`).join("\n");
    return `
    \\resumeProjectHeading
    {\\textbf{${escapeLatex(proj.title)}}${techStack}}{${escapeLatex(proj.date || "")}}
    \\resumeItemListStart
    ${bulletItems}
    \\resumeItemListEnd
    `;
  }).join("")}
\\resumeSubHeadingListEnd
` : "";

  // --- ACHIEVEMENTS SECTION ---
  const achievementsLatex = achievements.length > 0 ? `
\\section{Achievements \\& Leadership}
\\resumeSubHeadingListStart
${achievements.map(ach => `\\resumeItem{${escapeLatex(ach)}}`).join("\n")}
\\resumeSubHeadingListEnd
` : "";


  // --- DOCUMENT PREAMBLE & COMBINATION ---
  return `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & #2 \\\\
    \\textit{\\small#3} & \\textit{\\small #4} \\\\
  \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

${headerLatex}

${educationLatex}

${skillsLatex}

${experienceLatex}

${projectsLatex}

${achievementsLatex}

\\end{document}
`;
};
