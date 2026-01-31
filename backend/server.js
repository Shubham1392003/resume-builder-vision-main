import { generateResumeLatex } from "./latex/generateResumeLatex.js";

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
app.use(cors());
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
      await fetch("http://localhost:5000/generate-latex", {
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

        // 8️⃣ Save URL in DB
        await supabase
          .from("resumes")
          .update({ pdf_url: data.publicUrl })
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
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
