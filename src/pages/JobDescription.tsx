import { useState } from "react";
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";


import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";

import {
  Target,
  Sparkles,
  ArrowRight,
  ClipboardPaste,
  Briefcase,
  Building2,
  MapPin,
} from "lucide-react";


const JobDescription = () => {
  
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  console.log("Resume ID from URL:", resumeId);

  if (!resumeId) {
  return (
    <Layout hideFooter>
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Resume not found
        </h2>
        <p className="text-muted-foreground mb-6">
          Please create a resume first.
        </p>
        <Link to="/create-resume">
          <Button>Create Resume</Button>
        </Link>
      </div>
    </Layout>
  );
}


  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDetails({ ...jobDetails, description: text });
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  // ✅ STAGE 2: SAVE JOB DESCRIPTION ONLY
  const saveJobDescription = async () => {
    if (!user || !jobDetails.description.trim()) {
      alert("Job description is required");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("job_descriptions").insert({
      user_id: user.id,
      resume_id: resumeId,
      title: jobDetails.title,
      company: jobDetails.company,
      location: jobDetails.location,
      description: jobDetails.description,
    });
    if (!resumeId) {
  alert("Resume ID missing. Please create resume again.");
  return;
}


    setSaving(false);

    if (error) {
      console.error("Failed to save job description:", error);
      alert("Failed to save job description");
      return;
    }

    // 🚀 Stage 3 will use this data
    navigate(`/preview?resumeId=${resumeId}`);
  };

  return (
    <Layout hideFooter>
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              <Target className="h-4 w-4" />
              Job Matching
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Paste Your Target Job
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI will analyze the job description and optimize your resume
              for maximum impact
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="md:col-span-3">
              <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-6 md:p-8">
                <div className="space-y-6">
                  {/* Job Title & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        Job Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Senior Software Engineer"
                        value={jobDetails.title}
                        onChange={(e) =>
                          setJobDetails({
                            ...jobDetails,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="flex items-center gap-2"
                      >
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Company
                      </Label>
                      <Input
                        id="company"
                        placeholder="Google, Meta, etc."
                        value={jobDetails.company}
                        onChange={(e) =>
                          setJobDetails({
                            ...jobDetails,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="San Francisco, CA / Remote"
                      value={jobDetails.location}
                      onChange={(e) =>
                        setJobDetails({
                          ...jobDetails,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">
                        Job Description *
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handlePaste}
                        className="text-primary"
                      >
                        <ClipboardPaste className="h-4 w-4 mr-2" />
                        Paste from clipboard
                      </Button>
                    </div>

                    <Textarea
                      id="description"
                      placeholder="Paste the full job description here...

Include requirements, responsibilities, and qualifications for best results."
                      className="min-h-[300px] font-mono text-sm"
                      value={jobDetails.description}
                      onChange={(e) =>
                        setJobDetails({
                          ...jobDetails,
                          description: e.target.value,
                        })
                      }
                    />

                    <p className="text-sm text-muted-foreground">
                      The more detailed the job description, the better we can
                      optimize your resume.
                    </p>
                  </div>

                  {/* ✅ BUTTON LOGIC ONLY CHANGED */}
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={saveJobDescription}
                    disabled={saving}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Targeted Resume
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tips Section (UNCHANGED) */}
            <div className="md:col-span-2">
              <div className="sticky top-24">
                <div className="bg-accent/50 rounded-2xl p-6 border border-primary/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Tips for Best Results
                  </h3>
                  
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <span>Copy the <strong>entire job posting</strong> including requirements, responsibilities, and qualifications.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <span>Include any <strong>specific skills</strong> or technologies mentioned in the listing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <span>Don't worry about formatting—our AI understands various job posting formats.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">4</span>
                      <span>The more <strong>detailed</strong> the description, the more tailored your resume will be.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-card border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">How it works:</strong> Our AI analyzes keywords, skills, and requirements from the job description to highlight your most relevant experience and optimize your resume for ATS systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDescription;
