import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import ScrollReveal from "@/components/ui/ScrollReveal";

import {
  Plus,
  FileText,
  Clock,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Target,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Resume = {
  id: string;
  title: string | null;
  created_at: string;
  downloads?: number;
  job_descriptions?: Array<{
    company: string;
    title: string;
  }>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0); // Force re-fetch

  const [stats, setStats] = useState({
    totalResumes: 0,
    jobMatches: 0,
    downloads: 0,
  });

  // ✅ Fetch resumes & stats from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch Resumes with Job Description data (company name)
      const { data: resumesData, error: resumesError } = await supabase
        .from("resumes")
        .select(`
          *,
          job_descriptions (
            company,
            title
          )
        `) 
        .order("created_at", { ascending: false });

      if (resumesError) {
        console.error("Failed to fetch resumes:", resumesError);
      } else {
        setResumes(resumesData || []);
      }

      // 2. Fetch Job Matches (Job Descriptions count)
      const { count: jobsCount, error: jobsError } = await supabase
        .from("job_descriptions")
        .select("*", { count: "exact", head: true });

      if (jobsError) {
        console.error("Failed to fetch job stats:", jobsError);
      }

      setStats({
        totalResumes: resumesData?.length || 0,
        jobMatches: jobsCount || 0,
        downloads: resumesData?.reduce((sum, r) => sum + (r.downloads || 0), 0) || 0,
      });

      setLoading(false);
    };

    fetchData();
  }, [user, refreshKey]);

  // --- ACTIONS ---
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [resumeToRename, setResumeToRename] = useState<Resume | null>(null);
  const [newName, setNewName] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) {
      alert("Failed to delete resume");
    } else {
      setResumes(resumes.filter((r) => r.id !== id));
    }
  };

  const openRenameDialog = (resume: Resume) => {
    setResumeToRename(resume);
    setNewName(resume.title || "");
    setRenameDialogOpen(true);
  };

  const handleRenameSave = async () => {
    if (!resumeToRename || !newName.trim()) return;

    const { error } = await supabase
      .from("resumes")
      .update({ title: newName })
      .eq("id", resumeToRename.id);

    if (error) {
      alert("Failed to rename resume");
    } else {
      setResumes(
        resumes.map((r) =>
          r.id === resumeToRename.id ? { ...r, title: newName } : r
        )
      );
      setRenameDialogOpen(false);
    }
  };

const handleDownload = (id: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  window.location.href = `${BACKEND_URL}/generate-pdf/${id}`;
};

  const statCards = [
    {
      label: "Total Resumes",
      value: stats.totalResumes.toString(),
      icon: FileText,
    },
    { 
      label: "Job Matches", 
      value: stats.jobMatches.toString(), 
      icon: Target 
    },
    { 
      label: "Downloads", 
      value: stats.downloads.toString(), 
      icon: Download 
    },
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <ScrollReveal animation="fade-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your resumes and track job matches
              </p>
            </div>
            <Link to="/create-resume">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                New Resume
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              animation={
                index === 0
                  ? "fade-left"
                  : index === 2
                  ? "fade-right"
                  : "fade-up"
              }
              delay={index * 150}
            >
              <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover-lift">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Resumes Header */}
        <ScrollReveal animation="blur" delay={300}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Your Resumes</h2>
          </div>
        </ScrollReveal>

        {/* Content */}
        {loading ? (
          <p className="text-muted-foreground">Loading resumes…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Resume Card */}
            <ScrollReveal animation="scale" delay={400}>
              <Link
                to="/create-resume"
                className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30 transition-all duration-500 min-h-[200px]"
              >
                <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-500">
                  <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <p className="font-semibold">Create New Resume</p>
                <p className="text-sm text-muted-foreground">
                  Start from scratch
                </p>
              </Link>
            </ScrollReveal>

            {/* Resume Cards */}
            {resumes.map((resume, index) => (
              <ScrollReveal
                key={resume.id}
                animation={index % 2 === 0 ? "fade-right" : "fade-left"}
                delay={500 + index * 150}
              >
                <div className="group p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                      <FileText className="h-6 w-6 text-accent-foreground" />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/preview?resumeId=${resume.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(resume.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => openRenameDialog(resume)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {resume.job_descriptions?.[0]?.company 
                      ? `${resume.job_descriptions[0].title || 'Resume'} @ ${resume.job_descriptions[0].company}`
                      : resume.title || "My Resume"}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(resume.created_at).toLocaleDateString()}
                  </div>

                  <Link
                    to={`/preview?resumeId=${resume.id}`}
                    className="mt-4 block"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      Open Resume
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Resume Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Frontend Dev @ Google"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
