
/* backend/ai/test_tailor.js */
import { tailorResume } from "./tailorResume.js";

// Mock Data
const mockResume = {
    personal_info: { fullName: "Test User", email: "test@example.com", location: "Remote" },
    skills: "JavaScript, React",
    experience: [
        {
            company: "StartUp Inc",
            role: "Frontend Dev",
            startDate: "2023",
            endDate: "2024",
            description: "Built UI components."
        }
    ],
    projects: [],
    education: []
};

const jobDescription = `
We are looking for a Senior Frontend Engineer to build scalable web apps.
Must have experience with React, TypeScript, and performance optimization.
Core Competencies: System Design, CI/CD, Agile.
`;

const runTest = async () => {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Skipping test: GEMINI_API_KEY not found in env.");
        return;
    }

    console.log("Testing AI Tailoring...");
    try {
        const tailored = await tailorResume(mockResume, jobDescription, "Senior Frontend Engineer", "BigTech Corp");

        console.log("--- TAILORED RESULT ---");
        console.log(JSON.stringify(tailored, null, 2));

        // Basic checks
        if (tailored.experience && tailored.experience.length > 0) {
            console.log("✅ Experience present");
            if (tailored.experience[0].description.length > mockResume.experience[0].description.length) {
                console.log("✅ Experience expanded");
            } else {
                console.warn("⚠️ Experience might not be expanded enough");
            }
        }
    } catch (error) {
        console.error("Test Failed:", error);
        if (error.response) {
            console.error("Response:", await error.response.text());
        }
    }
};

runTest();
