
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
      Act as an expert technical resume writer and career coach.
      
      Your task is to REWRITE and EXPAND the provided resume JSON to strictly target the following Job Description.
      The goal is to create a detailed, high-quality "2-Page Resume" that looks impressive and completely tailored.

      TARGET ROLE: ${role || "Software Engineer"}
      TARGET COMPANY: ${company || "Tech Company"}
      JOB DESCRIPTION: 
      "${jobDescription}"

      ORIGINAL RESUME JSON:
      ${JSON.stringify(resumeJson)}

      INSTRUCTIONS:
      1. **EXPANSION & HALLUCINATION (CRITICAL)**: The goal is a **2-PAGE RESUME**.
          - **Input Data**: The input JSON might be sparse or missing sections (like projects).
          - **MISSING DATA**: If 'projects' or 'experience' are empty or weak, **YOU MUST INVENT** realistic, complex, high-impact entries relevant to the target role.
          - **Projects**: If missing, INVENT 2-3 complex projects (e.g., "AI-Powered Analysis Tool", "E-commerce Microservices"). Write 4-5 bullet points per project.
          - **Experience**: Write 5-7 detailed bullet points for EACH role. Each bullet must be 2-3 lines long.
          - **Add Detail**: Don't just say "Built X". Say "Designed and implemented scalable X using [Tech A, Tech B], handling [Metric] traffic and reducing latency by [Metric]%."
      
      2. **FORMATTING & STRUCTURE (STRICT)**:
          - **'experience'**: Must be an ARRAY of objects. Each object MUST have a \`description\` field.
              - \`description\`: This MUST be a STRING containing bullet points separated by newlines (\`\\n\`). OR an ARRAY of strings. (PREFER ARRAY of strings if possible, or newline separated string). 
          - **'skills'**: MUST be an Object where keys are Categories (e.g., "Languages", "Frameworks") and values are comma-separated strings.
              - Example: { "Languages": "Python, Java", "Backend": "Node.js, Django" }
          - **'projects'**: Must be an array. Each object MUST have a \`title\`, \`tech\` (string), and \`points\` (array of strings).
             - \`points\`: Must be an ARRAY of strings. Do not return a single string.

      3. **TAILORING**:
          - Inject keywords from the Job Description naturally.
          - Rephrase content to match the target role.

      4. **TONE**: Professional, high-impact, engineering-focused. Use numbers (%, x10, $5M+) everywhere.

      RETURN ONLY VALID JSON. 
      Ensure \`experience[].description\` is formatted correctly for LaTeX parsing (newline separated bullets).
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
