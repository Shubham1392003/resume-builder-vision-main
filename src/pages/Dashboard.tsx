import { Link } from "react-router-dom";
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
  Target
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const resumes = [
    {
      id: 1,
      title: "Software Engineer Resume",
      targetJob: "Senior Frontend Developer",
      lastEdited: "2 hours ago",
      matchScore: 85,
    },
    {
      id: 2,
      title: "Product Manager Resume",
      targetJob: "Product Lead at Startup",
      lastEdited: "1 day ago",
      matchScore: 72,
    },
    {
      id: 3,
      title: "UX Designer Resume",
      targetJob: "Design Lead",
      lastEdited: "3 days ago",
      matchScore: 90,
    },
  ];

  const stats = [
    { label: "Total Resumes", value: "3", icon: FileText },
    { label: "Job Matches", value: "12", icon: Target },
    { label: "Downloads", value: "8", icon: Download },
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
                <Plus className="h-5 w-5" />
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
              animation={index === 0 ? "fade-left" : index === 2 ? "fade-right" : "fade-up"} 
              delay={index * 150}
            >
              <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover-lift">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Resumes Header */}
        <ScrollReveal animation="blur" delay={300}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <ScrollReveal animation="scale" delay={400}>
            <Link
              to="/create-resume"
              className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30 transition-all duration-500 min-h-[200px]"
            >
              <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-500">
                <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-500" />
              </div>
              <p className="font-semibold">Create New Resume</p>
              <p className="text-sm text-muted-foreground">Start from scratch</p>
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

                <h3 className="font-semibold mb-1 line-clamp-1">{resume.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                  {resume.targetJob}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {resume.lastEdited}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary">
                    <Target className="h-4 w-4" />
                    {resume.matchScore}% match
                  </div>
                </div>

                <Link to="/preview" className="mt-4 block">
                  <Button variant="secondary" size="sm" className="w-full">
                    Open Resume
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
