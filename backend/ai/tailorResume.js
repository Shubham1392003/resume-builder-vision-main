
/* backend/ai/tailorResume.js */
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

/**
 * Tailors and EXPANDS the resume to 2 pages based on a job description.
 * @param {Object} resumeJson - The original resume data
 * @param {String} jobDescription - Target JD
 * @param {String} role - Target Role
 * @param {String} company - Target Company
 * @returns {Promise<Object>} - The tailored resume JSON
 */
export const tailorResume = async (resumeJson, jobDescription, role, company) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error("Missing API Key. Please set GEMINI_API_KEY or OPENROUTER_API_KEY in .env");
        }

        const client = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": "https://resume-builder.com", // Optional, for OpenRouter rankings
                "X-Title": "Resume Builder", // Optional
            },
        });
        const prompt = `
      Act as an expert ATS resume writer and recruiter assistant.

      Your task is to generate a COMPLETE, ATS-OPTIMIZED, JOB-TARGETED resume
      even when the user provides INCOMPLETE, VAGUE, OR MISSING INFORMATION.

      IMPORTANT CONSTRAINTS:
      - Do NOT invent companies, job titles, degrees, or certifications.
      - You MAY intelligently infer responsibilities, skills, tools, and exposure based on:
        • Job title
        • Education background
        • Projects
        • Target Job Description
      - All content must remain realistic, ethical, and defensible.

      PRIMARY OBJECTIVE:
      Make the resume appear COMPLETE, RELEVANT, and STRONG for ATS screening
      by aligning it tightly with the TARGET JOB DESCRIPTION.

      SECONDARY OBJECTIVE:
      Ensure every section contributes keywords and relevance,
      even if the user input is minimal.

      TARGET ROLE: ${role || "Software Engineer"}
      TARGET COMPANY: ${company || "Tech Company"}
      JOB DESCRIPTION: 
      "${jobDescription}"

      ORIGINAL RESUME JSON:
      ${JSON.stringify(resumeJson)}

      RESUME ENHANCEMENT RULES:

      1️⃣ EXPERIENCE SECTION (If empty or weak)
      - If experience descriptions are missing or minimal:
        → Generate 3–5 bullet points per role
        → Use industry-standard responsibilities from the job description
        → Phrase using:
           "Assisted in…"
           "Contributed to…"
           "Worked on…"
           "Hands-on experience with…"
      - Focus on SKILLS, TOOLS, WORKFLOWS, and IMPACT
      - Never claim leadership or ownership unless explicitly stated
      - **FORMATTING**: 'experience' must be an ARRAY of objects. Each object MUST have a \`description\` field.
          - \`description\`: This MUST be a STRING containing bullet points separated by newlines (\`\\n\`). OR an ARRAY of strings. (PREFER ARRAY of strings if possible, or newline separated string).

      2️⃣ EDUCATION SECTION (If only college/degree is provided)
      - Add:
        • Relevant coursework aligned to the job
        • Academic or practical exposure
        • Technical skills gained
      - If projects are relevant, reference them here

      3️⃣ PROJECTS SECTION (If only 1 project exists or descriptions are weak)
      - Expand project descriptions using:
        • Problem statement
        • Technologies used
        • Features implemented
        • Skills demonstrated
      - If user projects are insufficient:
        → Create 1–2 ROLE-ALIGNED PRACTICE PROJECTS
        → Clearly frame them as:
           "Academic Project", "Self-Directed Project", or "Practical Implementation"
      - **FORMATTING**: 'projects' Must be an array. Each object MUST have a \`title\`, \`tech\` (string), and \`points\` (array of strings).
         - \`points\`: Must be an ARRAY of strings. Do not return a single string.

      4️⃣ SKILLS SECTION (ATS Critical)
      - Extract REQUIRED SKILLS from the job description
      - Map them to:
        • Experience
        • Projects
        • Education
      - Group skills into:
        • Programming Languages
        • Frameworks & Tools
        • Databases
        • AI / ML / Domain Skills
      - Use exact keyword phrasing from the job description where possible
      - **FORMATTING**: 'skills' MUST be an Object where keys are Categories (e.g., "Languages", "Frameworks") and values are comma-separated strings.
          - Example: { "Languages": "Python, Java", "Backend": "Node.js, Django" }

      5️⃣ ACHIEVEMENTS & LEADERSHIP
      - Convert certifications, participation, or roles into impact-driven statements
      - Avoid vague soft-skill-only bullets
      
      6️⃣ LANGUAGE & FORMAT
      - Use strong action verbs
      - Use ATS-friendly bullet points
      - Avoid first-person pronouns
      - Ensure keyword density WITHOUT stuffing
      - Target 1.5–2 pages of content compatible with the provided JSON structure.

      RETURN ONLY VALID JSON matching the original structure logic.
      Ensure \`experience[].description\` is formatted correctly for LaTeX parsing (newline separated bullets or array).
    `;

        const completion = await client.chat.completions.create({
            model: "google/gemini-2.0-flash-001", // Fast, often free on OpenRouter
            messages: [
                { role: "system", content: "You are a helpful expert resume writer." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" } // Force JSON
        });

        const content = completion.choices[0].message.content;

        // Clean up markdown code blocks if present (just in case)
        const cleanedText = content.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("AI RAW OUTPUT:", cleanedText); // DEBUG LOG

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("AI Tailoring Error:", error);
        // Fallback?
        throw error;
    }
};
