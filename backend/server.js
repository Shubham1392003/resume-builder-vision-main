import { generateResumeLatex } from "./latex/generateResumeLatex.js";
import { tailorResume } from "./ai/tailorResume.js"; // Import tailoring logic

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

dotenv.config();

/* ================= HELPERS ================= */
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

/* ================= APP SETUP ================= */
const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://resume-builder-frontend.onrender.com',  // Add your Render frontend URL
    process.env.FRONTEND_URL  // Allow dynamic frontend URL from env
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

/* ================= SUPABASE ================= */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =====================================================
   POST /generate-latex
   ===================================================== */
app.post("/generate-latex", async (req, res) => {
  try {
    const { resume_id } = req.body;
    if (!resume_id) {
      return res.status(400).json({ error: "resume_id required" });
    }

    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .single();

    if (error || !resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // ✅ Generate LaTeX using function
    const latex = generateResumeLatex(resume);

    // ✅ Save to DB
    await supabase
      .from("resumes")
      .update({ latex })
      .eq("id", resume_id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "LaTeX generation failed" });
  }
});

/* =====================================================
   POST /tailor-resume
   ===================================================== */
app.post("/tailor-resume", async (req, res) => {
  try {
    const { resume_id, job_description, target_role, target_company } = req.body;

    if (!resume_id || !job_description) {
      return res.status(400).json({ error: "resume_id and job_description are required" });
    }

    // 1. Fetch original resume
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .single();

    if (error || !resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // 2. Call AI to tailor and expand
    // Only tailor if JSON data is present (assuming 'personal_info' etc are columns or in a jsonb column called 'data')
    // Based on previous code, 'resume' object *is* the data row.
    // If specific fields (personal_info) are columns, we pass the whole object.

    // We assume the DB row has columns matching the JSON structure (personal_info, experience, etc.)
    // OR it has a single 'resume_data' column. 
    // The previous code destructured 'resume': const { personal_info... } = resume. 
    // So 'resume' itself is the object containing fields.

    // HOWEVER, Supabase returns row data including metadata (id, created_at, etc). 
    // Pass only relevant fields to AI to avoid hallucinations or clutter.
    const resumeData = {
      personal_info: resume.personal_info,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills,
      projects: resume.projects,
      achievements: resume.achievements
    };

    console.log(`Tailoring resume ${resume_id} for role: ${target_role}`);
    const tailoredJson = await tailorResume(resumeData, job_description, target_role, target_company);
    console.log("TAILORED RESUME KEYS:", Object.keys(tailoredJson));
    if (tailoredJson.projects) console.log("Projects param count:", tailoredJson.projects.length);
    if (tailoredJson.experience) console.log("Experience param count:", tailoredJson.experience.length);

    // 3. Generate new LaTeX from tailored JSON
    const latex = generateResumeLatex(tailoredJson);

    // 4. Save result
    // Option A: Overwrite existing 'latex' and update data columns?
    // Option B: Just return it for now (safer)?
    // User request: "company targeted". Likely wants to SAVE it as a new version or update current.
    // I will update the 'latex' column so the PDF generation works with the NEW content.
    // AND I should probably update the JSON data in DB so if they generate again, it persists?
    // WARNING: Overwriting user's original data might be bad if they want to revert.
    // SAFE APPROACH: Update 'latex' only? No, if we generate PDF later, we might re-generate latex from stale JSON?
    // generate-pdf endpoint CHECKS 'resume.latex'. If missing, it regenerates from JSON.
    // So if we update 'latex', it works. 
    // BUT if the user edits the resume in the frontend, they see OLD data.
    // Ideally we update the JSON columns too.

    await supabase
      .from("resumes")
      .update({
        personal_info: tailoredJson.personal_info,
        education: tailoredJson.education,
        experience: tailoredJson.experience,
        skills: tailoredJson.skills,
        projects: tailoredJson.projects,
        achievements: tailoredJson.achievements,
        latex: latex,
        title: `${target_role} @ ${target_company}` // ✅ Auto-rename
      })
      .eq("id", resume_id);

    console.log("Tailoring complete and saved.");
    res.json({ success: true, tailored_json: tailoredJson });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tailoring failed", details: err.message });
  }
});



/* =====================================================
   GET /generate-pdf/:resume_id
   (GENERATE → UPLOAD → CACHE → REDIRECT)
   ===================================================== */
app.get("/generate-pdf/:resume_id", async (req, res) => {
  try {
    const { resume_id } = req.params;

    // 1️⃣ Fetch resume
    let { data: resume, error } = await supabase
      .from("resumes")
      .select("latex, pdf_url")
      .eq("id", resume_id)
      .single();

    if (error || !resume) {
      return res.status(404).send("Resume not found");
    }

    // 2️⃣ If PDF already exists → redirect
    if (resume.pdf_url) {
      return res.redirect(resume.pdf_url);
    }

    // 3️⃣ Generate LaTeX if missing
    if (!resume.latex) {
      await fetch(`http://localhost:${PORT}/generate-latex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id }),
      });

      const retry = await supabase
        .from("resumes")
        .select("latex")
        .eq("id", resume_id)
        .single();

      if (!retry.data?.latex) {
        return res.status(500).send("LaTeX generation failed");
      }

      resume.latex = retry.data.latex;
    }

    // 4️⃣ Prepare temp folders
    const texDir = path.join(process.cwd(), "tmp/tex");
    const pdfDir = path.join(process.cwd(), "tmp/pdf");
    fs.mkdirSync(texDir, { recursive: true });
    fs.mkdirSync(pdfDir, { recursive: true });

    const texPath = path.join(texDir, `${resume_id}.tex`);
    const pdfPath = path.join(pdfDir, `${resume_id}.pdf`);

    fs.writeFileSync(texPath, resume.latex);

    // 5️⃣ Run pdflatex
    exec(
      `pdflatex -interaction=nonstopmode -output-directory="${pdfDir}" "${texPath}"`,
      async () => {
        if (!fs.existsSync(pdfPath)) {
          return res.status(500).send("PDF generation failed");
        }

        // 6️⃣ Upload to Supabase Storage
        const pdfBuffer = fs.readFileSync(pdfPath);

        const { error: uploadError } = await supabase.storage
          .from("resume-pdfs")
          .upload(`${resume_id}.pdf`, pdfBuffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) {
          console.error(uploadError);
          return res.status(500).send("PDF upload failed");
        }

        // 7️⃣ Get public URL
        const { data } = supabase.storage
          .from("resume-pdfs")
          .getPublicUrl(`${resume_id}.pdf`);

        // 8️⃣ Increment download count and save URL
        // First, get current download count
        const { data: resumeData } = await supabase
          .from("resumes")
          .select("downloads")
          .eq("id", resume_id)
          .single();

        const currentDownloads = resumeData?.downloads || 0;

        // Then update with incremented count
        await supabase
          .from("resumes")
          .update({
            pdf_url: data.publicUrl,
            downloads: currentDownloads + 1
          })
          .eq("id", resume_id);

        // 9️⃣ Cleanup temp files
        fs.unlinkSync(texPath);
        fs.unlinkSync(pdfPath);

        // 🔁 Redirect browser to PDF
        return res.redirect(data.publicUrl);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

/* ================= HEALTH ================= */
app.get("/", (_, res) => res.send("Backend running 🚀"));

/* ================= START ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
