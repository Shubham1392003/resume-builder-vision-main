export function generateResumeLatex(resume) {
  const {
    personal_info,
    experience,
    education,
    skills,
  } = resume;

  return `
\\documentclass[11pt]{article}
\\usepackage[a4paper,margin=1in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]

\\begin{document}

% ===== HEADER =====
\\begin{center}
  {\\LARGE \\textbf{${personal_info.fullName || ""}}} \\\\
  ${personal_info.email || ""} \\ | ${personal_info.phone || ""} \\\\
  ${personal_info.linkedin || ""} \\ | ${personal_info.website || ""}
\\end{center}

% ===== SUMMARY =====
\\section*{Summary}
${personal_info.summary || ""}

% ===== EXPERIENCE =====
\\section*{Experience}
${(experience || [])
  .map(
    (exp) => `
\\textbf{${exp.position || ""}} — ${exp.company || ""} \\\\
${exp.startDate || ""} -- ${exp.endDate || ""}

\\begin{itemize}[leftmargin=*]
${(exp.description || "")
  .split("\\n")
  .map((d) => `\\item ${d}`)
  .join("\n")}
\\end{itemize}
`
  )
  .join("\n")}

% ===== EDUCATION =====
\\section*{Education}
${(education || [])
  .map(
    (edu) => `
\\textbf{${edu.degree || ""}} in ${edu.field || ""} \\\\
${edu.institution || ""} — ${edu.graduationDate || ""} ${
      edu.gpa ? `(GPA: ${edu.gpa})` : ""
    }
`
  )
  .join("\n")}

% ===== SKILLS =====
\\section*{Skills}
${skills || ""}

\\end{document}
`;
}
