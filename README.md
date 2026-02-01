<div align="center">

# 🎯 AI Resume Builder

### Craft Perfect Resumes with AI-Powered Tailoring

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=vercel)](https://resume-builder-vision-main.vercel.app/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-blue?style=for-the-badge)](https://openrouter.ai/)

*A modern, AI-powered resume builder that helps you create ATS-friendly resumes tailored to specific job descriptions. Built with React, Supabase, and powered by Google Gemini AI.*

</div>

---

## ✨ Features at a Glance

<table>
<tr>
<td width="50%">

### 🎯 Core Features
- 📝 **Multi-Step Resume Builder** - Intuitive 6-step creation process
- 🤖 **AI Resume Tailoring** - Automatically optimize for job descriptions
- 📄 **Auto-Fill from Upload** - Extract data from existing resumes (PDF/DOCX)
- 📊 **Dashboard Analytics** - Track resumes, job matches, and downloads
- 🌓 **Dark Mode** - Beautiful dark theme support
- 📱 **Responsive Design** - Works perfectly on all devices

</td>
<td width="50%">

### 🚀 Advanced Features
- 🎨 **LaTeX PDF Generation** - Professional, ATS-optimized output
- 💾 **Cloud Storage** - All resumes saved to Supabase
- 🔄 **Resume Versioning** - Rename and manage multiple versions
- 🏢 **Company Tracking** - Link resumes to job applications
- ⬇️ **Download Counter** - Track resume downloads
- 🔍 **Smart Preview** - Live PDF preview before download

</td>
</tr>
</table>

---

## 🚀 Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![LaTeX](https://img.shields.io/badge/LaTeX-008080?style=for-the-badge&logo=latex&logoColor=white)

</div>

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + **Shadcn UI** components
- **React Router** for navigation
- **PDF.js** & **Mammoth.js** for file parsing
- **Lucide React** for icons

### Backend
- **Node.js** + **Express.js**
- **LaTeX** for PDF generation
- **OpenRouter API** (Google Gemini 2.0 Flash)
- **Supabase** for database and authentication

### Database
- **PostgreSQL** (via Supabase)
- **Row-Level Security** policies
- **Supabase Storage** for PDF hosting

---

## 📂 Project Structure

```
resume-builder-vision-main/
│
├── 📁 backend/
│   ├── 📁 ai/
│   │   └── 🤖 tailorResume.js       # AI resume optimization
│   ├── 📁 latex/
│   │   └── 📄 generateResumeLatex.js # LaTeX template generator
│   ├── 🔧 server.js                  # Express server & API routes
│   └── 🔐 .env                       # Environment variables
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── 📁 ui/                    # Shadcn UI components
│   ├── 📁 pages/
│   │   ├── 🏠 Home.tsx
│   │   ├── 📝 CreateResume.tsx       # 6-step resume builder
│   │   ├── 📊 Dashboard.tsx          # Resume management
│   │   ├── 🎯 JobDescription.tsx     # Job matching
│   │   └── 👁️ Preview.tsx            # PDF preview
│   ├── 📁 hooks/
│   │   └── useAuth.tsx               # Supabase auth hook
│   └── 🎨 index.css                  # Global styles
│
├── 📁 supabase/
│   └── 📁 functions/
│       └── extract-resume/           # Edge function for AI extraction
│
└── 📖 README.md                      # You are here!
```

---

## 🛠️ How It Works

### 1️⃣ **Resume Creation Flow**
```
Step 1: Personal Info → Step 2: Experience → Step 3: Projects
     ↓
Step 4: Education → Step 5: Skills → Step 6: Achievements
     ↓
Save to Database → Navigate to Job Matching
```

### 2️⃣ **AI Resume Tailoring**
```javascript
// Backend: backend/ai/tailorResume.js
const tailoredResume = await openai.chat.completions.create({
  model: "google/gemini-2.0-flash-001",
  messages: [
    { role: "system", content: "You are a professional resume writer..." },
    { role: "user", content: `Tailor this resume for ${jobTitle} at ${company}` }
  ]
});
```
The AI expands bullet points, invents relevant projects if needed, and ensures 2-page length.

### 3️⃣ **LaTeX PDF Generation**
```javascript
// Backend: backend/latex/generateResumeLatex.js
const latexContent = `
\\documentclass[11pt,a4paper]{article}
\\begin{document}
  \\section*{${personalInfo.fullName}}
  ...
\\end{document}
`;
// Compile with pdflatex
execSync(`pdflatex -output-directory=${outputDir} ${texFile}`);
```

### 4️⃣ **Auto-Fill from Upload**
```javascript
// Supabase Edge Function
const extractedData = await openai.chat.completions.create({
  messages: [{
    role: "user",
    content: `Extract resume data as JSON: ${resumeText}`
  }]
});
// Returns: { fullName, email, experience, projects, ... }
```

### 5️⃣ **Dashboard with Company Names**
```javascript
// Frontend: src/pages/Dashboard.tsx
const { data } = await supabase
  .from("resumes")
  .select(`
    *,
    job_descriptions (company, title)
  `);
// Display: "Software Engineer @ Google"
```

---

## 🎯 API Integration

### OpenRouter API (Google Gemini)
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemini-2.0-flash-001',
    messages: [...]
  })
});
```

### Supabase Database Schema
```sql
-- Resumes Table
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT,
  personal_info JSONB,
  experience JSONB,
  education JSONB,
  skills TEXT,
  projects JSONB,
  achievements JSONB,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP
);

-- Job Descriptions Table
CREATE TABLE job_descriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  resume_id UUID REFERENCES resumes,
  company TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP
);
```

---

## 🐳 Docker Architecture

This project uses **Docker** to provide a consistent and reliable environment for LaTeX PDF generation.

### Why Docker?
- **LaTeX Environment:** LaTeX requires specific system-level binaries and font packages that aren't available in standard serverless or Node.js environments.
- **Portability:** Docker ensures the backend runs identically on local machines, Railway, or any other cloud provider.
- **Optimized Image:** We use a `node:18-slim` base and a curated list of TeX Live packages to keep the image size small (~600MB) and build times fast.

### Key Components
- `Dockerfile`: Configures the Debian-based environment, installs `pdflatex`, and sets up the Node.js server.
- `.dockerignore`: Ensures that local `node_modules` and temporary files don't bloat the production image.

---

## 🚧 Setup & Installation

### Prerequisites
- Node.js 18+
- LaTeX distribution (TeX Live, MiKTeX, or MacTeX)
- Supabase account
- OpenRouter API key

### 1. Clone the Repository
```bash
git clone https://github.com/Shubham1392003/resume-builder-vision-main.git
cd resume-builder-vision-main
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Environment Variables
Create `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
PORT=5000
```

Create `.env` in root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Database Setup
Run the SQL migrations in Supabase SQL Editor:
```sql
-- See supabase/migrations/ for full schema
ALTER TABLE resumes ADD COLUMN downloads INTEGER DEFAULT 0;
```

### 5. Deploy Supabase Edge Function
```bash
supabase functions deploy extract-resume
```

### 6. Run the Application
```bash
# Terminal 1: Backend
cd backend
node server.js

# Terminal 2: Frontend
npm run dev
```

Visit `http://localhost:5173`

### 7. Deployment (Production)

#### Backend (Railway.app)
1. Use the provided `Dockerfile` at the project root.
2. Set the build type to **Docker**.
3. Add environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`.
4. Railway will automatically expose port 10000.

#### Frontend (Vercel)
1. Connect your repository to Vercel.
2. Add environment variable: `VITE_BACKEND_URL` (your Railway URL).
3. Vercel will build and deploy the Vite app.

---

## 💡 Key Features Breakdown

### 🤖 AI Resume Tailoring
- Automatically expands experience bullets to 2-3 lines
- Invents relevant projects if input is sparse
- Ensures strict 2-page resume length
- Optimizes keywords for ATS systems

### 📄 Auto-Fill from Upload
- Supports PDF and DOCX files
- Extracts all sections including Projects and Achievements
- Uses AI to parse unstructured resume text
- Populates all 6 form steps automatically

### 📊 Dashboard Analytics
- **Total Resumes**: Count of all your resumes
- **Job Matches**: Number of job descriptions saved
- **Downloads**: Total PDF downloads across all resumes

### 🏢 Company Name Display
Resumes linked to job descriptions show as:
```
"Software Engineer @ Google"
"Data Scientist @ Meta"
```

---

## 🌟 Future Enhancements

- [ ] 📧 **Email Integration** - Send resumes directly to recruiters
- [ ] 🎨 **Multiple Templates** - Choose from different LaTeX styles
- [ ] 📊 **ATS Score** - Real ATS compatibility scoring
- [ ] 🔗 **LinkedIn Import** - Auto-fill from LinkedIn profile
- [ ] 📱 **Mobile App** - React Native version
- [ ] 🌐 **Multi-language** - Support for multiple languages
- [ ] 🤝 **Collaboration** - Share and get feedback on resumes



## 👨‍💻 Author

<div align="center">

### **Developed & Built by Shubham Madhav Kendre**

*AI/ML & Full Stack Developer*

[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://sk-coral.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shubham1392003)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/shubham.x003/)

</div>

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ and lots of ☕**

</div>
