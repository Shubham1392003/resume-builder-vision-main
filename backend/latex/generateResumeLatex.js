// backend/latex/generateResumeLatex.js

// ✅ STEP 1: DEFINE escapeLatex FIRST
const escapeLatex = (text = "") =>
  String(text)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");

// ✅ STEP 2: EXPORT THE FUNCTION
export function generateResumeLatex(resume) {
  const {
    personal_info,
    experience = [],
    education = [],
    skills = "",
    projects = [],
    achievements = [],
  } = resume;

  return `
\\documentclass[11pt]{article}
\\usepackage[a4paper,margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\setlength{\\parindent}{0pt}
\\setlist[itemize]{noitemsep, topsep=2pt}

\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{${escapeLatex(personal_info?.fullName)}}} \\\\
  ${escapeLatex(personal_info?.email)} $|$
  ${escapeLatex(personal_info?.phone)} $|$
  ${escapeLatex(personal_info?.linkedin)} $|$
  ${escapeLatex(personal_info?.location)}
\\end{center}

\\section*{Professional Summary}
${escapeLatex(personal_info?.summary)}

\\section*{Technical Skills}
\\begin{itemize}
${escapeLatex(skills)
  .split(",")
  .map((s) => `\\item ${s.trim()}`)
  .join("\n")}
\\end{itemize}

\\section*{Experience}
${experience
  .map(
    (exp) => `
\\textbf{${escapeLatex(exp.position)}} — ${escapeLatex(exp.company)} \\\\
${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}
\\begin{itemize}
${(exp.description || "")
  .split("\\n")
  .map((d) => `\\item ${escapeLatex(d)}`)
  .join("\n")}
\\end{itemize}
`
  )
  .join("\n")}

\\section*{Projects}
${projects
  .map(
    (project) => `
\\textbf{${escapeLatex(project.title)}} $|$ ${escapeLatex(project.tech)}
\\begin{itemize}
${(project.points || [])
  .map((p) => `\\item ${escapeLatex(p)}`)
  .join("\n")}
\\end{itemize}
`
  )
  .join("\n")}

\\section*{Education}
${education
  .map(
    (edu) => `
\\textbf{${escapeLatex(edu.degree)}} — ${escapeLatex(edu.institution)} \\\\
${escapeLatex(edu.graduationDate)}
`
  )
  .join("\n")}

\\section*{Achievements}
\\begin{itemize}
${achievements.map((a) => `\\item ${escapeLatex(a)}`).join("\n")}
\\end{itemize}

\\end{document}
`;
}
