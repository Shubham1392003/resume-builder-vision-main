import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { generateResumeLatex } from "./latex/resumeTemplate.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Supabase Admin Client (SERVICE ROLE KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
app.get("/ping", (req, res) => {
  res.send("Backend alive");
});


/**
 * STEP 5 — POST /generate-latex
 * body: { resume_id }
 */
app.post("/generate-latex", async (req, res) => {
  try {
    const { resume_id } = req.body;

    if (!resume_id) {
      return res.status(400).json({ error: "resume_id is required" });
    }

    // 1️⃣ Fetch resume from DB
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .single();

    if (error || !resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // 2️⃣ Convert Resume JSON → LaTeX
    const latex = generateResumeLatex(resume);

    // 3️⃣ Return LaTeX
    res.json({
      success: true,
      latex,
    });
  } catch (err) {
    console.error("LaTeX generation error:", err);
    res.status(500).json({ error: "Failed to generate LaTeX" });
  }
});

// 🚀 Start backend server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
