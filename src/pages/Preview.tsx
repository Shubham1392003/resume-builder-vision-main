import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { 
  Download, 
  Edit, 
  Share2, 
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Target,
  ArrowLeft
} from "lucide-react";

const Preview = () => {
  // Dummy resume data for preview
  const resumeData = {
    personalInfo: {
      fullName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/sarahjohnson",
      website: "sarahjohnson.dev",
      summary: "Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud architecture. Passionate about creating exceptional user experiences and mentoring junior developers."
    },
    experiences: [
      {
        company: "TechCorp Inc.",
        position: "Senior Software Engineer",
        startDate: "Jan 2021",
        endDate: "Present",
        description: [
          "Led development of microservices architecture serving 2M+ daily users",
          "Reduced page load times by 40% through performance optimization",
          "Mentored team of 5 junior developers, improving code quality by 30%"
        ]
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        startDate: "Mar 2018",
        endDate: "Dec 2020",
        description: [
          "Built React-based dashboard processing $10M+ in monthly transactions",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
          "Collaborated with design team to improve user satisfaction scores"
        ]
      }
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "M.S.",
        field: "Computer Science",
        graduationDate: "2018"
      },
      {
        institution: "UC Berkeley",
        degree: "B.S.",
        field: "Computer Science",
        graduationDate: "2016"
      }
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL", "Agile"]
  };

  const matchScore = 92;

  return (
    <Layout hideFooter>
      <div className="container py-8">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/job-description">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Resume Preview</h1>
              <p className="text-muted-foreground text-sm">
                AI-optimized for your target role
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              <Target className="h-4 w-4" />
              {matchScore}% Job Match
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-elevated p-8 md:p-12 text-gray-900">
              {/* Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {resumeData.personalInfo.fullName}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <a href={`mailto:${resumeData.personalInfo.email}`} className="flex items-center gap-1 hover:text-gray-900">
                    <Mail className="h-4 w-4" />
                    {resumeData.personalInfo.email}
                  </a>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {resumeData.personalInfo.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {resumeData.personalInfo.location}
                  </span>
                  <a href="#" className="flex items-center gap-1 hover:text-gray-900">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a href="#" className="flex items-center gap-1 hover:text-gray-900">
                    <Globe className="h-4 w-4" />
                    Portfolio
                  </a>
                </div>
              </div>

              {/* Summary */}
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resumeData.personalInfo.summary}
                </p>
              </section>

              {/* Experience */}
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1">
                  Experience
                </h2>
                <div className="space-y-5">
                  {resumeData.experiences.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-2">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1">
                  Education
                </h2>
                <div className="space-y-3">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar - Match Analysis */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Match Score Card */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Job Match Analysis
                </h3>

                <div className="relative mb-6">
                  <div className="flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${matchScore * 2.51} 251`}
                          className="text-primary"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{matchScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>8/10 required skills matched</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Experience level aligned</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Keywords optimized for ATS</span>
                  </div>
                </div>
              </div>

              {/* Keywords Matched */}
              <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-6">
                <h3 className="font-semibold mb-4">Keywords Matched</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "TypeScript", "AWS", "Microservices", "Leadership"].map((keyword) => (
                    <span 
                      key={keyword}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-accent/50 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-semibold mb-3">Ready to Apply?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your resume is optimized and ready. Download it now to apply for your target role.
                </p>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Preview;
