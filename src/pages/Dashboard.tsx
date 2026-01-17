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

type Resume = {
  id: string;
  title: string | null;
  created_at: string;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch resumes from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchResumes = async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch resumes:", error);
      } else {
        setResumes(data || []);
      }

      setLoading(false);
    };

    fetchResumes();
  }, [user]);

  const stats = [
    {
      label: "Total Resumes",
      value: resumes.length.toString(),
      icon: FileText,
    },
    { label: "Job Matches", value: "—", icon: Target },
    { label: "Downloads", value: "—", icon: Download },
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
          {stats.map((stat, index) => (
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {resume.title || "Untitled Resume"}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(resume.created_at).toLocaleDateString()}
                  </div>

                  <Link
                    to={`/preview?id=${resume.id}`}
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
    </Layout>
  );
};

export default Dashboard;
