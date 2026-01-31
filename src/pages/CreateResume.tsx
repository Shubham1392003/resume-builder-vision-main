import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";
import mammoth from "mammoth";

import { useNavigate } from "react-router-dom";


pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

const CreateResume = () => {
const navigate = useNavigate();
const saveResumeToDB = async () => {
  if (!user) {
    alert("Not logged in");
    return null;
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: "My Resume",
      personal_info: personalInfo,
      experience: experiences,
      education: education,
      skills: skills,
    })
    .select("id") // 👈 IMPORTANT
    .single();

  if (error) {
    console.error("Resume save failed:", error);
    alert("Resume save failed");
    return null;
  }

  console.log("Resume saved with ID:", data.id);
  return data.id; // 👈 RETURN resume_id
};


  type UploadStage = "idle" | "uploading" | "extracting" | "ai" | "done";

  const [stage, setStage] = useState<UploadStage>("idle");

  const { user } = useAuth();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadResume = async () => {
    if (!resumeFile || !user) return;

    try {
      setStage("uploading");

      const filePath = `${user.id}/${Date.now()}-${resumeFile.name}`;

      const { error } = await supabase.storage
        .from("resumes")
        .upload(filePath, resumeFile);

      if (error) {
        alert("Upload failed");
        setStage("idle");
        return;
      }

      setStage("extracting");
      await extractResumeText(resumeFile);

      setStage("done");
    } catch (err) {
      console.error(err);
      setStage("idle");
    }
  };

  const extractWithAI = async (text: string) => {
    setStage("ai");

    const res = await fetch(
      "https://ykystgmlmldvxfmtohej.supabase.co/functions/v1/extract-resume",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ text }),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("AI extraction failed:", err);
      setStage("idle");
      throw new Error("AI extraction failed");
    }

    const data = await res.json();
    fillFormFromAI(data);
  };

  const fillFormFromAI = (data: any) => {
    setPersonalInfo({
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      linkedin: data.linkedin || "",
      website: data.website || "",
      summary: data.summary || "",
    });

    setSkills(data.skills?.join(", ") || "");

    setEducation(
      (data.education || []).map((edu: any) => ({
        id: Date.now() + Math.random(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        graduationDate: edu.graduationDate || "",
        gpa: edu.gpa || "",
      })),
    );

    setExperiences(
      (data.experience || []).map((exp: any) => ({
        id: Date.now() + Math.random(),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: Array.isArray(exp.description)
          ? exp.description.join("\n")
          : exp.description || "",
      })),
    );
  };

  const extractResumeText = async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    let text = "";

    if (extension === "pdf") {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ");
      }
    }

    if (extension === "docx") {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      text = result.value;
    }

    await extractWithAI(text);
  };

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: 1,
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
    },
  ]);

  const [skills, setSkills] = useState("");

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (id: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const updateExperience = (
    id: number,
    field: keyof Experience,
    value: string,
  ) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    );
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now(),
        institution: "",
        degree: "",
        field: "",
        graduationDate: "",
        gpa: "",
      },
    ]);
  };

  const removeEducation = (id: number) => {
    if (education.length > 1) {
      setEducation(education.filter((edu) => edu.id !== id));
    }
  };

  const updateEducation = (
    id: number,
    field: keyof Education,
    value: string,
  ) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    );
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Experience", icon: Briefcase },
    { number: 3, title: "Education", icon: GraduationCap },
    { number: 4, title: "Skills", icon: Award },
  ];

  return (
    <Layout hideFooter>
      <div className="container py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.number ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step >= s.number
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? "✓" : s.number}
                  </div>
                  <span className="hidden sm:block font-medium">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 md:w-24 h-1 mx-2 rounded-full transition-colors ${
                      step > s.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-6 md:p-8">
            {/* Step 1: Personal Info */}

            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  Personal Information
                </h2>
                {/* Resume Upload */}
                <div className="mb-6 p-4 rounded-xl border border-dashed border-border">
                  <Label>Upload Existing Resume (PDF / DOCX)</Label>

                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setResumeFile(file); // ✅ THIS WAS MISSING
                      }
                    }}
                  />

                  <Button
                    variant="outline"
                    className="mt-3"
                    disabled={stage !== "idle"}
                    onClick={uploadResume}
                  >
                    {stage === "uploading" && "Uploading file..."}
                    {stage === "extracting" && "Reading resume..."}
                    {stage === "ai" && "AI is extracting info..."}
                    {stage === "done" && "Resume imported ✓"}
                    {stage === "idle" && "Upload Resume"}
                  </Button>

                  <p className="text-sm text-muted-foreground mt-2">
                    We’ll extract information after upload
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={personalInfo.fullName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="San Francisco, CA"
                      value={personalInfo.location}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      placeholder="linkedin.com/in/johndoe"
                      value={personalInfo.linkedin}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          linkedin: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website/Portfolio</Label>
                    <Input
                      id="website"
                      placeholder="johndoe.com"
                      value={personalInfo.website}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="A brief summary of your professional background and career goals..."
                    className="min-h-[120px]"
                    value={personalInfo.summary}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        summary: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Work Experience
                </h2>

                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">
                          Experience {index + 1}
                        </span>
                        {experiences.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "company",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            placeholder="Job Title"
                            value={exp.position}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "position",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            placeholder="Jan 2020"
                            value={exp.startDate}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "startDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            placeholder="Present"
                            value={exp.endDate}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "endDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-[100px]"
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={addExperience}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Experience
                </Button>
              </div>
            )}

            {/* Step 3: Education */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Education
                </h2>

                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">
                          Education {index + 1}
                        </span>
                        {education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            placeholder="University Name"
                            value={edu.institution}
                            onChange={(e) =>
                              updateEducation(
                                edu.id,
                                "institution",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            placeholder="Bachelor's, Master's, etc."
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(edu.id, "degree", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            placeholder="Computer Science"
                            value={edu.field}
                            onChange={(e) =>
                              updateEducation(edu.id, "field", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Graduation Date</Label>
                          <Input
                            placeholder="May 2022"
                            value={edu.graduationDate}
                            onChange={(e) =>
                              updateEducation(
                                edu.id,
                                "graduationDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={addEducation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Education
                </Button>
              </div>
            )}

            {/* Step 4: Skills */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Skills & Expertise
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js, Python, Project Management)"
                      className="min-h-[150px]"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Tip: Include both technical skills and soft skills
                      relevant to your target job.
                    </p>
                  </div>

                  {skills && (
                    <div className="p-4 rounded-xl bg-accent/50">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.split(",").map(
                          (skill, index) =>
                            skill.trim() && (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                              >
                                {skill.trim()}
                              </span>
                            ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {step < totalSteps ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={async () => {
                      const resumeId = await saveResumeToDB();
                      if (!resumeId) return;

                      // ✅ Navigate ONLY after save
                      navigate(`/job-description?resumeId=${resumeId}`);

                    }}
                  >
                    Save & Continue to Job Match
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateResume;
