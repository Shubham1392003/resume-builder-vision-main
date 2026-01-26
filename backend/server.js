import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

dotenv.config();

/* ---------------- APP SETUP ---------------- */
const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- SUPABASE CLIENT ---------------- */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =====================================================
   POST /generate-latex
   body: { resume_id }
   ===================================================== */
app.post("/generate-latex", async (req, res) => {
  try {
    const { resume_id } = req.body;

    if (!resume_id) {
      return res.status(400).json({ error: "resume_id required" });
    }

    // 1️⃣ Fetch resume data
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .single();

    if (error || !resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const { personal_info, experience, education, skills } = resume;

    // 2️⃣ Generate LaTeX
    const latex = `
\\documentclass[11pt]{article}
\\usepackage[a4paper,margin=1in]{geometry}
\\usepackage{enumitem}
\\setlist[itemize]{noitemsep, topsep=0pt}
\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{${personal_info.fullName}}} \\\\
  ${personal_info.email} | ${personal_info.phone}
\\end{center}

\\section*{Summary}
${personal_info.summary}

\\section*{Skills}
${skills}

\\section*{Experience}
${(experience || [])
  .map(
    (exp) => `
\\textbf{${exp.position}} — ${exp.company} \\\\
${exp.startDate} -- ${exp.endDate}
\\begin{itemize}
${exp.description
  .split("\n")
  .map((d) => `\\item ${d}`)
  .join("\n")}
\\end{itemize}
`
  )
  .join("\n")}

\\section*{Education}
${(education || [])
  .map(
    (edu) => `
\\textbf{${edu.degree}} in ${edu.field} \\\\
${edu.institution} (${edu.graduationDate})
`
  )
  .join("\n")}

\\end{document}
`;

    // 3️⃣ Save LaTeX in DB
    const { data: updated, error: updateError } = await supabase
      .from("resumes")
      .update({ latex })
      .eq("id", resume_id)
      .select();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    if (!updated || updated.length === 0) {
      return res
        .status(404)
        .json({ error: "Resume update failed (no rows affected)" });
    }

    // 4️⃣ Done
    res.json({
      success: true,
      resume_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* =====================================================
   POST /generate-pdf
   body: { resume_id }
   ===================================================== */
app.post("/generate-pdf", async (req, res) => {
  try {
    const { resume_id } = req.body;

    if (!resume_id) {
      return res.status(400).json({ error: "resume_id required" });
    }

    // 1️⃣ Fetch LaTeX
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("latex")
      .eq("id", resume_id)
      .single();

    if (error || !resume?.latex) {
      return res.status(404).json({ error: "LaTeX not found" });
    }

    // 2️⃣ Paths
    const texDir = path.join(process.cwd(), "tmp/tex");
    const pdfDir = path.join(process.cwd(), "tmp/pdf");

    if (!fs.existsSync(texDir)) fs.mkdirSync(texDir, { recursive: true });
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const texPath = path.join(texDir, `${resume_id}.tex`);
    const pdfPath = path.join(pdfDir, `${resume_id}.pdf`);

    // 3️⃣ Write .tex
    fs.writeFileSync(texPath, resume.latex);

    // 4️⃣ Run pdflatex
exec(
  `pdflatex -interaction=nonstopmode -output-directory="${pdfDir}" "${texPath}"`,
  (error, stdout, stderr) => {
    // 👇 If PDF exists, treat as success
    if (fs.existsSync(pdfPath)) {
      return res.sendFile(pdfPath);
    }

    console.error("LaTeX error:", error);
    console.error(stderr);
    return res.status(500).json({ error: "PDF generation failed" });
  }
);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ---------------- START SERVER ---------------- */
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
