
/* backend/latex/test_latex.js */
import { generateResumeLatex } from "./generateResumeLatex.js";
import fs from "fs";

// Mock data provided in the prompt
const mockResume = {
    personal_info: {
        fullName: "Shubham Kendre",
        email: "skendre380@gmail.com",
        phone: "9028924151",
        linkedin: "https://linkedin.com/in/shubham-kendre-23b605285",
        github: "https://github.com/Shubham1392003",
        location: "Pune, Maharashtra",
        // Summary should be ignored by the generator
        summary: "Motivated engineering student..."
    },
    education: [
        {
            institution: "G.H. Raisoni College of Engineering and Management",
            location: "Pune, Maharashtra",
            degree: "Bachelor of Technology in Artificial Intelligence and Machine Learning; CGPA: 8.39/10.0",
            graduationDate: "Expected Graduation: 2027"
        }
    ],
    skills: {
        "Programming Languages": "C, C++, Python, JavaScript, SQL",
        "Frameworks & Libraries": "Django, React.js, Next.js, Node.js, Express.js, Tailwind CSS, Pandas, NumPy, Scikit-learn, Matplotlib, TensorFlow, OpenCV",
        "Frontend Technologies": "HTML, CSS, Bootstrap 5, JavaScript, SvelteKit",
        "Databases": "PostgreSQL, Supabase, MySQL, SQLite",
        "Developer Tools": "VS Code, Git, GitHub, Jupyter Notebook, Visual Studio, Django Admin",
        "Core Concepts": "Data Structures and Algorithms, RESTful APIs, Machine Learning, DBMS, Object-Oriented Programming, Software Engineering"
    },
    projects: [
        {
            title: "Tour Booking Website",
            tech: "Python, Django, HTML, CSS, Bootstrap, JavaScript, SQLite",
            date: "2025",
            points: [
                "Developed a full-stack tour booking web application with tour listings, detail pages, cart system, and booking history",
                "Implemented category-based filtering, dynamic pricing, session-based cart, and booking workflow",
                "Designed responsive UI with auto-sliding hero section and featured tour slider",
                "Managed backend models, admin panel, media files, and database using Django ORM"
            ]
        },
        {
            title: "Bhagavad Gita UI Recreation",
            tech: "SvelteKit, Tailwind CSS, REST API",
            date: "2025",
            points: [
                "Recreated a pixel-perfect and responsive Bhagavad Gita webpage UI using SvelteKit",
                "Integrated Bhagavad Gita slokas API via custom backend proxy to resolve CORS issues",
                "Rendered chapter-wise Sanskrit verses, English meanings, and audio data"
            ]
        }
    ],
    experience: [
        // Mocking experience to match the structure, even if not fully detailed in the prompt snippet body
        {
            company: "Tech Corp",
            location: "Pune, India",
            position: "Software Engineer Intern",
            startDate: "June 2024",
            endDate: "Aug 2024",
            description: "Optimized database queries decreasing load time by 30%\\nCollaborated with cross-functional teams to deploy features."
        }
    ],
    achievements: [
        "Smart India Hackathon (SIH) 2025 Finalist",
        "Active LeetCode Problem Solver",
        "Open Source Contributor with multiple real-world projects on GitHub"
    ]
};

console.log("Generating LaTeX...");
const latex = generateResumeLatex(mockResume);

console.log("--- GENERATED LATEX START ---");
console.log(latex);
console.log("--- GENERATED LATEX END ---");

// Simple verification checks
const requiredStrings = [
    "\\documentclass[letterpaper,11pt]{article}",
    "\\section{Experience}",
    "\\section{Projects}",
    "Tour Booking Website",
    "Smart India Hackathon",
    "\\resumeSubheading",
    "Motivated engineering student" // SHOULD NOT BE PRESENT
];

const missing = [];
requiredStrings.forEach(s => {
    if (s === "Motivated engineering student") {
        if (latex.includes(s)) console.error("FAILED: Professional Summary should NOT be present");
        else console.log("PASSED: Professional Summary is omitted.");
    } else {
        if (!latex.includes(s)) missing.push(s);
    }
});

if (missing.length > 0) {
    console.error("FAILED. Missing required strings:", missing);
    process.exit(1);
} else {
    console.log("SUCCESS: All structure checks passed.");
}
